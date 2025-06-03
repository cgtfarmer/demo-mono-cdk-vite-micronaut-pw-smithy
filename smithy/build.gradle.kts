plugins {
  `java-library`
  id("software.amazon.smithy.gradle.smithy-jar").version("1.2.0")
  // id("software.amazon.smithy") version "1.2.0"
}

repositories {
  mavenLocal()
  mavenCentral()
}

dependencies {
  smithyBuild("software.amazon.smithy:smithy-openapi:1.58.0")

  smithyBuild("software.amazon.smithy:smithy-aws-traits:1.58.0")

  // Required for restJson1 trait.
  implementation("software.amazon.smithy:smithy-aws-traits:1.58.0")

  implementation("software.amazon.smithy.typescript:smithy-aws-typescript-codegen:0.29.0")

  implementation("software.amazon.smithy.typescript:smithy-typescript-codegen:0.30.0")
}
