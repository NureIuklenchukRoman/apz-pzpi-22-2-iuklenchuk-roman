package com.example.warehouseapp

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.NavHostController
import com.example.warehouseapp.data.RentalDetailResponse
import com.example.warehouseapp.ui.screens.auth.LoginScreen
import com.example.warehouseapp.ui.screens.auth.RegisterScreen
import com.example.warehouseapp.ui.screens.home.HomeScreen
import com.example.warehouseapp.ui.screens.profile.ProfileScreen
import com.example.warehouseapp.ui.screens.warehouses.WarehousesScreen
import com.example.warehouseapp.ui.screens.warehouses.WarehouseDetailsScreen
import com.example.warehouseapp.ui.screens.warehouses.MyWarehousesScreen
import com.example.warehouseapp.ui.screens.warehouses.EditWarehouseScreen
import com.example.warehouseapp.ui.screens.warehouses.AddWarehouseScreen
import com.example.warehouseapp.ui.screens.warehouses.RentalsScreen
import com.example.warehouseapp.ui.screens.messages.MessagesScreen
import com.example.warehouseapp.ui.screens.admin.AdminPanelScreen

import com.example.warehouseapp.ui.screens.rentals.RentDetailScreen
import com.example.warehouseapp.ui.screens.rentals.MyRentalsScreen

import com.example.warehouseapp.ui.screens.warehouses.RevenueScreen


sealed class Screen(val route: String) {
    object Login : Screen("login")
    object Register : Screen("register")
    object Home : Screen("home")
    object Profile : Screen("profile")
    object AdminPanel : Screen("admin-panel")
    object Warehouses : Screen("warehouses")
    object NewRent : Screen("new-rent")
    object MyRents : Screen("my-rents")
    object Revenue : Screen("revenue")

    object DetailedRent : Screen("detailed-rent/{rentId}") {
        fun createRoute(rentId: Int) = "detailed-rent/$rentId"
    }


    object WarehouseDetails : Screen("warehouse/{warehouseId}") {
        fun createRoute(warehouseId: String) = "warehouse/$warehouseId"
    }
    object MyWarehouses : Screen("my-warehouses")
    object EditWarehouse : Screen("edit-warehouse/{warehouseId}") {
        fun createRoute(warehouseId: String) = "edit-warehouse/$warehouseId"
    }
    object AddWarehouse : Screen("add-warehouse")
    object Rentals : Screen("rentals")
    object Messages : Screen("messages")
    object CreateRent : Screen("create-rent/{warehouseId}") {
        fun createRoute(warehouseId: String) = "create-rent/$warehouseId"
    }
}

@Composable
fun WarehouseApp(navController: NavHostController) {
    NavHost(navController = navController, startDestination = Screen.Login.route) {
        composable(Screen.Login.route) {
            LoginScreen(navController)
        }
        composable(Screen.Register.route) {
            RegisterScreen(navController)
        }
        composable(Screen.Home.route) {
            HomeScreen(navController)
        }
        composable(Screen.Profile.route) {
            ProfileScreen(navController)
        }
        composable(Screen.CreateRent.route) { backStackEntry ->
            val warehouseId = backStackEntry.arguments?.getString("warehouseId") ?: ""
            RentalsScreen(navController = navController, warehouseId = warehouseId)
        }
        composable(Screen.Warehouses.route) {
            WarehousesScreen(navController)
        }
        composable(Screen.WarehouseDetails.route) { backStackEntry ->
            val warehouseId = backStackEntry.arguments?.getString("warehouseId") ?: ""
            WarehouseDetailsScreen(navController, warehouseId)
        }
        composable(Screen.MyWarehouses.route) {
            MyWarehousesScreen(navController)
        }
        composable(Screen.DetailedRent.route) { backStackEntry ->
            val rentId = backStackEntry.arguments?.getString("rentId") ?: ""
            RentDetailScreen(navController, rentId)
        }
        composable(Screen.MyRents.route) {
            MyRentalsScreen(navController)
        }
        composable(Screen.EditWarehouse.route) { backStackEntry ->
            val warehouseId = backStackEntry.arguments?.getString("warehouseId") ?: ""
            EditWarehouseScreen(navController, warehouseId)
        }
        composable(Screen.AddWarehouse.route) {
            AddWarehouseScreen(navController)
        }
        composable(Screen.Revenue.route) {
            RevenueScreen(navController)
        }

        composable(Screen.Messages.route) {
            MessagesScreen(navController)
        }
        composable(Screen.AdminPanel.route) {
            AdminPanelScreen(navController)
        }
    }
}
