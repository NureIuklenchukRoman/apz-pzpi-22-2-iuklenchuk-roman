package com.example.warehouseapp.data

import kotlinx.serialization.Serializable

@Serializable
data class BackupCreateRes(
    val message: String,
    val backupId: String
)

@Serializable
data class BackupRestoreRes(
    val message: String,
    val success: Boolean
) 