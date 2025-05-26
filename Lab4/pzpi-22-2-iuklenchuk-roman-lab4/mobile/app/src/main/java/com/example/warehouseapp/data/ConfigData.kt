package com.example.warehouseapp.data

import kotlinx.serialization.Serializable

@Serializable
data class ConfigRule(
  val parameter: String,
  val condition: String,
  val value: Double,
  val message: String
)

@Serializable
data class ImportConfigRes(
  val message: String
)