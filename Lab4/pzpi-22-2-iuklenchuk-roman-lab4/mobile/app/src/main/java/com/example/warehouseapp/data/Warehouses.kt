import kotlinx.serialization.Serializable

@Serializable
data class UserCreateDto(
    val username: String,
    val email: String,
    val password: String,
    val role: String,
    val first_name: String,
    val last_name: String
)

@Serializable
data class ChangePasswordRequest(
    val old_password: String,
    val new_password: String
)

@Serializable
data class TokenResponse(
    val access_token: String,
    val refresh_token: String,
    val token_type: String
)

@Serializable
data class GenericResponse(
    val msg: String
)

@Serializable
data class WarehouseResponse(
    val id: Int,
    val name: String,
    val location: String? = null,
    val size_sqm: Float,
    val price_per_day: Float,
    val is_blocked: Boolean = false
)

@Serializable
data class WarehouseSchema(
    val name: String,
    val location: String,
    val size_sqm: Double,
    val price_per_day: Double
    // val available_premium_services: List<String>? = null // Закоментовано як у Python
)

@Serializable
data class WarehouseDetails(
    val id: Int,
    val name: String,
    val location: String,
    val price_per_day: Double,
    val busy_dates: List<String> // ISO 8601 (e.g. "2024-05-25") - якщо хочеш тип Date, скажи
)

@Serializable
data class WarehouseCreateSchema(
    val name: String,
    val location: String,
    val size_sqm: Double,
    val price_per_day: Double
)

@Serializable
data class WarehouseUpdateSchema(
    val name: String? = null,
    val location: String? = null,
    val size_sqm: Double? = null,
    val price_per_day: Double? = null
    // val available_premium_services: List<String>? = null // Закоментовано як у Python
)

@Serializable
data class WarehouseDeleteSchema(
    val id: Int
)

@Serializable
data class WarehouseQuerySchema(
    val name: String? = null,
    val location: String? = null,
    val min_price: Double? = null,
    val max_price: Double? = null,
    val min_size: Double? = null,
    val max_size: Double? = null,
    val is_blocked: Boolean? = null
)

@Serializable
data class WarehouseResponseSchema(
    val id: Int,
    val name: String,
    val location: String? = null,
    val size_sqm: Double,
    val price_per_day: Double,
    val is_blocked: Boolean = false
    // val available_premium_services: List<String>? = null
)