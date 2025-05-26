package com.example.warehouseapp.api

import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import okhttp3.Response

object RetrofitClient {
  private const val BASE_URL = "http://10.0.2.2:8000/api/"

  @Volatile
  private var accessToken: String? = null

  fun updateAccessToken(newToken: String?) {
    synchronized(this) {
      accessToken = newToken
    }
  }

  private val loggingInterceptor = HttpLoggingInterceptor().apply {
    level = HttpLoggingInterceptor.Level.BODY
  }

  private val authInterceptor = Interceptor { chain ->
    val originalRequest = chain.request()
    val modifiedRequest = accessToken?.let { token ->
      originalRequest.newBuilder()
        .header("Authorization", "Bearer $token")
        .build()
    } ?: originalRequest
    chain.proceed(modifiedRequest)
  }

  private val okHttpClient = OkHttpClient.Builder()
    .addInterceptor(loggingInterceptor)
    .addInterceptor(authInterceptor)
    .build()

  private val retrofit: Retrofit by lazy {
    Retrofit.Builder()
      .baseUrl(BASE_URL)
      .client(okHttpClient)
      .addConverterFactory(GsonConverterFactory.create())
      .build()
  }

  val apiService: ApiService by lazy {
    retrofit.create(ApiService::class.java)
  }
}
