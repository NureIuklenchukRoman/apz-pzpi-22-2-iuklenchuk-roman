package com.example.warehouseapp.ui.screens.admin

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.warehouseapp.api.RetrofitClient
import com.example.warehouseapp.data.UserResponse
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdminPanelScreen(navController: NavController) {
    val scope = rememberCoroutineScope()

    var users by remember { mutableStateOf<List<UserResponse>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var successMessage by remember { mutableStateOf<String?>(null) }
    var blockLoadingId by remember { mutableStateOf<Int?>(null) }
    var backupLoading by remember { mutableStateOf(false) }

    // fetchUsers suspending function returns Result<List<UserResponse>>
    suspend fun fetchUsers(): Result<List<UserResponse>> {
        return try {
            val response = RetrofitClient.apiService.getUsers()
            if (response.isSuccessful) {
                Result.success(response.body() ?: emptyList())
            } else {
                Result.failure(Exception("Failed to load users: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun blockUser(userId: Int): Result<Unit> {
        return try {
            val response = RetrofitClient.apiService.blockUser(userId)
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                Result.failure(Exception("Failed to block user: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun unblockUser(userId: Int): Result<Unit> {
        return try {
            val response = RetrofitClient.apiService.unblockUser(userId)
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                Result.failure(Exception("Failed to unblock user: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun downloadBackup(): Result<Unit> {
        return try {
            val response = RetrofitClient.apiService.downloadBackup()
            if (response.isSuccessful) {
                // TODO: Handle file saving here
                Result.success(Unit)
            } else {
                Result.failure(Exception("Failed to download backup: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    LaunchedEffect(Unit) {
        isLoading = true
        errorMessage = null
        fetchUsers().fold(
            onSuccess = {
                users = it
                isLoading = false
            },
            onFailure = {
                errorMessage = it.localizedMessage ?: "Unknown error"
                isLoading = false
            }
        )
    }

    fun refreshUsers() {
        scope.launch {
            isLoading = true
            errorMessage = null
            successMessage = null
            fetchUsers().fold(
                onSuccess = {
                    users = it
                    successMessage = "Users refreshed"
                    isLoading = false
                },
                onFailure = {
                    errorMessage = it.localizedMessage ?: "Unknown error"
                    isLoading = false
                }
            )
        }
    }

    fun onBlockUser(userId: Int) {
        scope.launch {
            blockLoadingId = userId
            errorMessage = null
            successMessage = null
            blockUser(userId).fold(
                onSuccess = {
                    successMessage = "User blocked successfully"
                    refreshUsers()
                },
                onFailure = {
                    errorMessage = it.localizedMessage ?: "Failed to block user"
                }
            )
            blockLoadingId = null
        }
    }

    fun onUnblockUser(userId: Int) {
        scope.launch {
            blockLoadingId = userId
            errorMessage = null
            successMessage = null
            unblockUser(userId).fold(
                onSuccess = {
                    successMessage = "User unblocked successfully"
                    refreshUsers()
                },
                onFailure = {
                    errorMessage = it.localizedMessage ?: "Failed to unblock user"
                }
            )
            blockLoadingId = null
        }
    }

    fun onDownloadBackup() {
        scope.launch {
            backupLoading = true
            errorMessage = null
            successMessage = null
            downloadBackup().fold(
                onSuccess = {
                    successMessage = "Backup downloaded successfully"
                },
                onFailure = {
                    errorMessage = it.localizedMessage ?: "Failed to download backup"
                }
            )
            backupLoading = false
        }
    }


    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Admin Panel") })
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
        ) {
            if (errorMessage != null) {
                Text(errorMessage ?: "", color = MaterialTheme.colorScheme.error)
                Spacer(Modifier.height(8.dp))
            }
            if (successMessage != null) {
                Text(successMessage ?: "", color = MaterialTheme.colorScheme.primary)
                Spacer(Modifier.height(8.dp))
            }

            Button(
                onClick = { onDownloadBackup() },
                enabled = !backupLoading,
                modifier = Modifier.fillMaxWidth()
            ) {
                if (backupLoading) {
                    CircularProgressIndicator(modifier = Modifier.size(16.dp), strokeWidth = 2.dp)
                    Spacer(Modifier.width(8.dp))
                    Text("Downloading Backup...")
                } else {
                    Text("Download Backup")
                }
            }

            Spacer(Modifier.height(16.dp))

            if (isLoading) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator()
                }
            } else {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(users) { user ->
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text("Username: ${user.username}", style = MaterialTheme.typography.titleMedium)
                                    Text("Email: ${user.email}", style = MaterialTheme.typography.bodyMedium)
                                    Text("Role: ${user.role}", style = MaterialTheme.typography.bodyMedium)
                                    Text(
                                        "Status: ${if (user.is_blocked == true) "Blocked" else "Active"}",
                                        style = MaterialTheme.typography.bodyMedium,
                                        color = if (user.is_blocked == true) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.primary
                                    )
                                }
                                Button(
                                    onClick = {
                                        if (user.is_blocked == true) {
                                            onUnblockUser(user.id)
                                        } else {
                                            onBlockUser(user.id)
                                        }
                                    },
                                    enabled = blockLoadingId != user.id
                                ) {
                                    if (blockLoadingId == user.id) {
                                        CircularProgressIndicator(modifier = Modifier.size(16.dp), strokeWidth = 2.dp)
                                        Spacer(Modifier.width(8.dp))
                                    }
                                    Text(if (user.is_blocked == true) "Unblock" else "Block")
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
