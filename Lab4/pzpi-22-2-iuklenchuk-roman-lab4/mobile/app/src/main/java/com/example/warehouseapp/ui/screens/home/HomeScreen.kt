package com.example.warehouseapp.ui.screens.home

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.compose.ui.graphics.vector.ImageVector
import kotlinx.coroutines.launch

import com.example.warehouseapp.TokenManager
import com.example.warehouseapp.api.RetrofitClient

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(navController: NavController) {
    var selectedItem by remember { mutableStateOf("home") }
    val userRole = remember { mutableStateOf<String?>(null) }
    val coroutineScope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        userRole.value = TokenManager.getUserRole()
    }

    val navItems = remember(userRole.value) {
        if (userRole.value == "admin") {
            listOf(
                "home" to Icons.Default.Home,
                "warehouses" to Icons.Default.Storage,
                "messages" to Icons.Default.Message,
                "admin-panel" to Icons.Default.Settings
            )
        } else if (userRole.value == "seller"){
            listOf(
                "home" to Icons.Default.Home,
                "warehouses" to Icons.Default.Storage,
                "messages" to Icons.Default.Message,
                "my-rents" to Icons.Default.ShoppingCart,
                "revenue"  to Icons.Default.AttachMoney
            )
        } else {
            listOf(
                "home" to Icons.Default.Home,
                "warehouses" to Icons.Default.Storage,
                "messages" to Icons.Default.Message,
                "my-rents" to Icons.Default.ShoppingCart
            )
        }
    }

    val labelMap = mapOf(
        "home" to "Home",
        "warehouses" to "Warehouses",
        "messages" to "Messages",
        "admin-panel" to "Admin",
        "my-rents" to "My Rentals",
        "revenue" to "Revenue"
    )

    fun handleLogout() {
        coroutineScope.launch {
            // Clear the token from TokenManager
            TokenManager.clearToken()

            // Clear the token from RetrofitClient
            RetrofitClient.updateAccessToken(null)

            // Navigate to login screen and clear the back stack
            navController.navigate("login") {
                popUpTo(0) { inclusive = true }
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Warehouse App") },
                actions = {
                    IconButton(onClick = { /* TODO: Implement notifications */ }) {
                        Icon(Icons.Default.Notifications, contentDescription = "Notifications")
                    }
                    IconButton(onClick = { navController.navigate("profile") }) {
                        Icon(Icons.Default.Person, contentDescription = "Profile")
                    }
                    IconButton(onClick = { handleLogout() }) {
                        Icon(Icons.Default.ExitToApp, contentDescription = "Logout")
                    }
                }
            )
        },
        bottomBar = {
            NavigationBar {
                navItems.forEach { (route, icon) ->
                    NavigationBarItem(
                        icon = { Icon(icon, contentDescription = labelMap[route]) },
                        label = { Text(labelMap[route] ?: route) },
                        selected = selectedItem == route,
                        onClick = {
                            selectedItem = route
                            navController.navigate(route)
                        }
                    )
                }
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text(
                text = "Welcome to Warehouse App",
                style = MaterialTheme.typography.headlineMedium
            )
            userRole.value?.let { role ->
                Text(
                    text = "Your role: $role",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.primary
                )
            }
            Text(
                text = "Manage your warehouses and services efficiently",
                style = MaterialTheme.typography.bodyLarge
            )

            Spacer(modifier = Modifier.height(32.dp))

            // Alternative logout button in the main content area
            OutlinedButton(
                onClick = { handleLogout() },
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(
                    Icons.Default.ExitToApp,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text("Logout")
            }
        }
    }
}