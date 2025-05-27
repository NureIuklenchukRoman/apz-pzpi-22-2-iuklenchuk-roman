package com.example.warehouseapp.api

import com.example.warehouseapp.Screen
import com.example.warehouseapp.data.WarehouseDetails
import com.example.warehouseapp.data.ChangePasswordRequest
import com.example.warehouseapp.data.WarehouseResponseSchema
import com.example.warehouseapp.data.UserSchema
import com.example.warehouseapp.data.Token
import com.example.warehouseapp.data.UserCreate
import com.example.warehouseapp.data.UserResponse
import com.example.warehouseapp.data.PremiumService
import com.example.warehouseapp.data.RentWarehouseRequest
import com.example.warehouseapp.data.Rental
import com.example.warehouseapp.data.RentalDetailResponse
import com.example.warehouseapp.data.Message
import com.example.warehouseapp.data.RevenueData

import okhttp3.ResponseBody

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface ApiService {

  // -------- AUTH --------
  @FormUrlEncoded
  @POST("auth/login")
  suspend fun login(
    @Field("username") username: String,
    @Field("password") password: String
  ): Response<Token>

  @POST("auth/register")
  suspend fun register(
    @Body user: UserCreate
  ): Response<Token>

  @POST("auth/refresh-token")
  suspend fun refreshToken(
    @Query("refresh_token") refreshToken: String
  ): Response<Token>

  @POST("auth/restore-password")
  suspend fun restorePassword(
    @Query("email") email: String
  ): Response<Token>

  @POST("auth/change-password")
  suspend fun changePassword(
    @Body body: ChangePasswordRequest
  ): Response<Token>

  // -------- WAREHOUSES --------

  @GET("warehouses")
  suspend fun getAllWarehouses(
    @Query("name") name: String? = null,
    @Query("location") location: String? = null,
    @Query("min_price") minPrice: Float? = null,
    @Query("max_price") maxPrice: Float? = null,
    @Query("min_size") minSize: Float? = null,
    @Query("max_size") maxSize: Float? = null,
    @Query("is_blocked") isBlocked: Boolean? = null
  ): Response<List<WarehouseResponseSchema>>

  @GET("warehouses/my-warehouses")
  suspend fun getMyWarehouses(): Response<List<WarehouseResponseSchema>>

  @GET("users")
  suspend fun getUsers(): Response<List<UserResponse>>

  @GET("users/my_rents")
  suspend fun getMyRentals(): Response<List<Rental>>

  @GET("users/block_user")
  suspend fun blockUser(@Query("user_id") userId: Int): Response<Unit>

  @GET("users/unblock_user")
  suspend fun unblockUser(@Query("user_id") userId: Int): Response<Unit>

  @GET("backup")
  suspend fun downloadBackup(): Response<ResponseBody>

  @GET("users/my_rents/{rent_id}")
  suspend fun getMyRentDetail(
    @Path("rent_id") rentId: Int
  ): Response<RentalDetailResponse>

  @GET("warehouses/{id}")
  suspend fun getWarehouseDetails(@Path("id") id: Int): Response<WarehouseResponseSchema>

  @GET("services/warehouse-services/{warehouse_id}")
  suspend fun getWarehouseServices(
    @Path("warehouse_id") warehouseId: Int
  ): Response<List<PremiumService>>

  @POST("rent/{warehouse_id}")
  suspend fun rentWarehouse(
    @Path("warehouse_id") warehouseId: Int,
    @Body rentData: RentWarehouseRequest
  ): Response<Unit>

  @GET("messages/")
  suspend fun getMessages(): Response<List<Message>>

  @GET("revenue/seller")
  suspend fun getRevenue(@Query("time_range") timeRange: String = "month"): Response<RevenueData>


}
