$version: "2"

namespace com.cgtfarmer.user

use aws.protocols#restJson1

// Services
@restJson1
service UserService {
    version: "2025-01-01"
    resources: [
        User
    ]
    operations: [
        GetHealth
        //     ListUsers
        //     GetUser
        //     CreateUser
        //     UpdateUser
        //     DestroyUser
    ]
}

// Resources
resource User {
    identifiers: {
        userId: UserId
    }
    // properties: {
    //     firstName: String
    //     lastName: String
    //     age: Integer
    //     weight: Float
    //     smoker: Boolean
    // }
    read: GetUser
    list: ListUsers
    create: CreateUser
    update: PutUser
    delete: DestroyUser
}

// Types
string UserId

structure UserDto {
    userId: UserId

    @required
    firstName: String

    lastName: String

    age: Integer

    weight: Float

    smoker: Boolean
}

list UserList {
    member: UserDto
}

// "client" = 400s, "server" = 500s
@error("client")
@httpError(404)
structure ResourceNotFound {
    @required
    resourceType: String

    resourceId: String
}

// Operations
@tags(["root"])
@http(method: "GET", uri: "/health", code: 200)
@readonly
operation GetHealth {
    input: GetHealthRequest
    output: GetHealthResponse
}

@tags(["user"])
@http(method: "GET", uri: "/users", code: 200)
@readonly
operation ListUsers {
    input: ListUsersRequest
    output: ListUsersResponse
}

@tags(["user"])
@idempotent
@http(method: "POST", uri: "/users", code: 201)
operation CreateUser {
    input: CreateUserRequest
    output: CreateUserResponse
}

@tags(["user"])
@readonly
@http(method: "GET", uri: "/users/{userId}", code: 200)
operation GetUser {
    input: GetUserRequest
    output: GetUserResponse
    errors: [
        ResourceNotFound
    ]
}

@tags(["user"])
@idempotent
@http(method: "PUT", uri: "/users/{userId}", code: 200)
operation PutUser {
    input: PutUserRequest
    output: PutUserResponse
}

@tags(["user"])
@idempotent
@http(method: "DELETE", uri: "/users/{userId}", code: 200)
operation DestroyUser {
    input: DestroyUserRequest
    output: DestroyUserResponse
}

// Requests, Responses
@input
structure GetHealthRequest {}

@output
structure GetHealthResponse {
    @required
    message: String
}

@input
structure ListUsersRequest {}

@output
structure ListUsersResponse {
    @required
    users: UserList
}

@input
structure GetUserRequest {
    @required
    @httpLabel
    userId: UserId
}

@output
structure GetUserResponse {
    @required
    user: UserDto
}

@input
structure CreateUserRequest {
    @required
    user: UserDto
}

@output
structure CreateUserResponse {
    @required
    user: UserDto
}

@input
structure PutUserRequest {
    @required
    @httpLabel
    userId: UserId

    @required
    user: UserDto
}

@output
structure PutUserResponse {
    @required
    user: UserDto
}

@input
structure DestroyUserRequest {
    @required
    @httpLabel
    userId: UserId
}

@output
structure DestroyUserResponse {
    @required
    success: Boolean
}
