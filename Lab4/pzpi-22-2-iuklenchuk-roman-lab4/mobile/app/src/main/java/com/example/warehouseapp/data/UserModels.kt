package com.example.warehouseapp.data

import kotlinx.serialization.Serializable

@Serializable
data class CreateUserDto(
    val username: String,
    val password: String,
    val email: String
)

@Serializable
data class LoginResponse(
    val token: String,
    val userId: String,
    val username: String,
    val role: String
)

@Serializable
data class UserResponse(
    val id: Int,
    val username: String,
    val email: String,
    val role: String,
    val is_blocked: Boolean
)

@Serializable
data class Role(
    val id: String,
    val name: String,
    val description: String
)

@Serializable
data class UpdateUserRoleRequest(
    val userId: String,
    val roleId: String
) 