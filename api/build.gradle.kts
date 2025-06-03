import org.gradle.api.tasks.testing.logging.TestExceptionFormat
import org.gradle.api.tasks.testing.logging.TestLogEvent
import com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar

// Usage: gradle build -PoutDir=/tmp
val outDir: String? by project
outDir?.let {
  layout.buildDirectory.set(file(it))
}

// Usage: gradle test -Ptags="unit,integration,application,system"
val tags: String? by project

val isLocalDevelopment = System.getenv("ENV") == "local"

plugins {
  id("io.micronaut.application") version "4.5.3"
  id("com.gradleup.shadow") version "8.3.6"
  id("com.diffplug.spotless") version "7.0.3"
  id("io.micronaut.aot") version "4.5.3"
  id("io.micronaut.openapi") version "4.5.3"
}

group = "com.cgtfarmer"
version = "0.0.1"

// tasks.named<Jar>("jar") {
//   enabled = false
// }

java {
  sourceCompatibility = JavaVersion.toVersion("21")
  targetCompatibility = JavaVersion.toVersion("21")
}

graalvmNative.toolchainDetection = false

repositories {
  mavenLocal()
  mavenCentral()
}

dependencies {
  // General
  compileOnly("org.projectlombok:lombok:1.18.34")
  annotationProcessor("org.projectlombok:lombok:1.18.34")
  implementation("org.apache.commons:commons-lang3:3.14.0")
  runtimeOnly("org.yaml:snakeyaml")
  implementation("com.fasterxml.jackson.core:jackson-databind:2.17.2")
  /*
    Needed to serialize datetimes. Ex:

    ObjectMapper mapper = new ObjectMapper();
    mapper.registerModule(new JavaTimeModule());
  */
  // implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310:2.17.2")

  // AWS
  implementation(platform("software.amazon.awssdk:bom:2.25.65"))
  implementation("software.amazon.awssdk:dynamodb-enhanced")
  implementation("software.amazon.awssdk:s3:2.31.24")

  // Micronaut
  annotationProcessor("io.micronaut.serde:micronaut-serde-processor")
  annotationProcessor("io.micronaut:micronaut-http-validation")
  annotationProcessor("io.micronaut.validation:micronaut-validation-processor")
  implementation("io.micronaut.aws:micronaut-aws-apigateway")
  implementation("io.micronaut.aws:micronaut-aws-lambda-events-serde")
  implementation("io.micronaut.crac:micronaut-crac")
  implementation("io.micronaut.serde:micronaut-serde-jackson")
  implementation("io.micronaut.validation:micronaut-validation")
  // implementation("io.micronaut.sourcegen:micronaut-sourcegen-annotations")
  compileOnly("io.micronaut:micronaut-http-client-jdk")
  testImplementation("io.micronaut:micronaut-http-client-jdk")
  runtimeOnly("ch.qos.logback:logback-classic")
}

application {
  mainClass = "com.cgtfarmer.app.Application"
}

micronaut {
  version("4.8.2")
  // runtime("lambda_java")
  runtime(if (isLocalDevelopment) "netty" else "lambda_java")
  testRuntime("junit5")
  nativeLambda {
    // lambdaRuntimeClassName = "io.micronaut.function.aws.runtime.MicronautLambdaRuntime"
    lambdaRuntimeClassName = "io.micronaut.function.aws.runtime.APIGatewayV2HTTPEventMicronautLambdaRuntime"
  }
  processing {
    incremental(true)
    annotations("com.cgtfarmer.app.*")
  }
  aot {
    // Please review carefully the optimizations enabled below
    // Check https://micronaut-projects.github.io/micronaut-aot/latest/guide/ for more details
    optimizeServiceLoading = false
    convertYamlToJava = false
    precomputeOperations = true
    cacheEnvironment = true
    optimizeClassLoading = true
    deduceEnvironment = true
    optimizeNetty = true
    replaceLogbackXml = true
  }
  openapi {
    server(file("src/main/resources/UserService.openapi.json")) {
      // Controller interfaces
      // apiPackageName = "com.cgtfarmer.app.adapter.activity"
      apiPackageName = "com.smithy.api"
      // DTOs
      // modelPackageName = "com.cgtfarmer.app.adapter.activity.dto"
      modelPackageName = "com.smithy.model"
      controllerPackage = "com.smithy.controller"
      // (Optional) Reactor/Mono
      useReactive = false

      // Enable easy DTO construction
      lombok.set(true)
      requiredPropertiesInConstructor.set(false)
      additionalProperties.put("generateBuilders", "true")
      additionalModelTypeAnnotations.set(
        listOf("@lombok.Builder(toBuilder = true)")
      )
    }
  }
}

tasks.named<io.micronaut.gradle.docker.NativeImageDockerfile>("dockerfileNative") {
  jdkVersion = "21"
  args(
    "-XX:MaximumHeapSizePercent=80",
    "-Dio.netty.allocator.numDirectArenas=0",
    "-Dio.netty.noPreferDirect=true"
  )
}

spotless {
  java {
    eclipse("4.35")
      .configFile("eclipse-formatter.xml")
    // googleJavaFormat("1.26.0")
    removeUnusedImports()
    importOrder()
    target("src/**/*.java")
  }
}

tasks.withType<JavaCompile> {
  options.encoding = "UTF-8"
  dependsOn(tasks.named("spotlessApply"))
}

tasks.withType<JavaCompile>().configureEach {
  doFirst {
    options.annotationProcessorPath = files(options.annotationProcessorPath?.files?.sortedBy { f ->
      if (f.name.contains("lombok")) {
        -1
      } else {
        0
      }
    })
  }
}

tasks.withType<Test> {
  useJUnitPlatform {
    tags
      ?.split(",")
      ?.map(String::trim)
      ?.filter(String::isNotEmpty)
      ?.takeIf(List<String>::isNotEmpty)
      ?.let { includeTags(*it.toTypedArray()) }
  }

  testLogging {
    events(
      TestLogEvent.FAILED,
      TestLogEvent.SKIPPED,
      TestLogEvent.STANDARD_ERROR,
      TestLogEvent.STANDARD_OUT
    )
    exceptionFormat = TestExceptionFormat.FULL
    showExceptions  = true
    showCauses      = true
    showStackTraces = true

    info.events          = debug.events
    info.exceptionFormat = debug.exceptionFormat
  }

  addTestListener(object : TestListener {
    override fun beforeSuite(suite: TestDescriptor) {
      if (!suite.name.startsWith("Gradle Test")) {
        println("\nRunning ${suite.name}")
      }
    }

    override fun afterSuite(
      suite: TestDescriptor,
      result: TestResult
    ) {
      val duration =
        "%.3f sec".format((result.endTime - result.startTime) / 1000.0)

      if (suite.name.startsWith("Gradle Test Executor")) {
        val summary =
          "Result: ${result.resultType} " +
          "(${result.testCount} tests, " +
          "${result.successfulTestCount} passed, " +
          "${result.failedTestCount} failed, " +
          "${result.skippedTestCount} skipped) $duration"
        val bar = "-".repeat(summary.length + 4)
        println("\n$bar\n|  $summary  |\n$bar")
      } else if (!suite.name.startsWith("Gradle Test")) {
        println(
          "Tests run: ${result.testCount}, " +
          "Failures: ${result.failedTestCount}, Errors: 0, " +
          "Skipped: ${result.skippedTestCount} Time elapsed: $duration"
        )
      }
    }

    override fun beforeTest(desc: TestDescriptor) {}
    override fun afterTest(desc: TestDescriptor, result: TestResult) {}
  })

  // Rerun tests even when files haven't changed
  outputs.upToDateWhen { false }
}

tasks.named("assemble") {
  dependsOn("shadowJar")
}
