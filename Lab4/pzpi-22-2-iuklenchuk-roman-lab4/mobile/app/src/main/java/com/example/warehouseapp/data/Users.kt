package com.example.warehouseapp.data
import kotlinx.serialization.Serializable

@Serializable
data class UserSchema(
    val username: String,
    val email: String? = null,
    val role: String? = null,
    val last_name: String? = null,
    val first_name: String? = null,
    val phone: String? = null
)

@Serializable
data class UserInDB(
    val username: String,
    val email: String? = null,
    val role: String? = null,
    val last_name: String? = null,
    val first_name: String? = null,
    val phone: String? = null,
    val password: String
)

data class Token(
    val access_token: String,
    val token_type: String,
    val refresh_token: String,
    val role: String
)

@Serializable
data class TokenData(
    val email: String? = null
)

@Serializable
data class ChangePassword(
    val old_password: String,
    val new_password: String
)

@Serializable
data class UserCreate(
    val username: String,
    val password: String,
    val email: String? = null,
    val role: String? = null,
    val last_name: String? = null,
    val first_name: String? = null,
    val phone: String? = null
)

@Serializable
data class TokenWithRefreshToken(
    val access_token: String,
    val refresh_token: String,
    val token_type: String = "bearer"
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
data class PremiumService(
    val id: Int,
    val warehouse_id: Int,
    val name: String,
    val description: String,
    val price: Float,
)

@Serializable
data class RentWarehouseRequest(
    val start_date: String,  // ISO 8601, e.g. "2025-05-25"
    val end_date: String,
    val selected_services: List<Int>?
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

@Serializable
data class ChangePasswordRequest(
    val old_password: String,
    val new_password: String
)

@Serializable
data class Message(
    val id: Int,
    val text: String,
    val created_at: String
)

@Serializable
data class Rental(
    val id: Int,
    val warehouse_name: String,
    val warehouse_location: String,
    val start_date: String,
    val end_date: String,
    val total_price: Float,
    val status: String,

)
@Serializable
data class RevenueData(
    val total_revenue: Double,
    val monthly_revenue: Double,
    val active_rentals: Int,
    val revenue_by_month: List<MonthRevenue>,
    val revenue_by_warehouse: List<WarehouseRevenue>,
    val revenue_by_service: List<ServiceRevenue>
)

@Serializable
data class MonthRevenue(val month: String, val revenue: Double)
@Serializable
data class WarehouseRevenue(val warehouse_name: String, val revenue: Double)
@Serializable
data class ServiceRevenue(val service_name: String, val revenue: Double)

@Serializable
data class RentalDetailResponse(
    val id: Int,
    val warehouse_name: String,
    val warehouse_location: String,
    val start_date: String,
    val end_date: String,
    val status: String,
    val total_price: Float,
    val code: String? // Може бути null
)
//@Serializable
//data class UserResponse(
//    val id: Int,
//    val username: String,
//    val email: String,
//    val role: String,
//    val is_blocked: Boolean? = false
//)