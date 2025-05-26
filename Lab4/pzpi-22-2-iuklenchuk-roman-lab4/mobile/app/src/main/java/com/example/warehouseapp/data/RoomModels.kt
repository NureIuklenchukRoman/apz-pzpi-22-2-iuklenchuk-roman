package com.example.warehouseapp.data

import kotlinx.serialization.Serializable

@Serializable
data class Room(
    val id: String,
    val name: String,
    val description: String,
    val ownerId: String,
    val temperature: Double,
    val humidity: Double,
    val lastUpdated: String
)

@Serializable
data class CreateRoomDto(
    val name: String,
    val description: String
)

@Serializable
data class RoomAnalysis(
    val roomId: String,
    val averageTemperature: Double,
    val averageHumidity: Double,
    val temperatureTrend: String,
    val humidityTrend: String,
    val lastUpdated: String
) 