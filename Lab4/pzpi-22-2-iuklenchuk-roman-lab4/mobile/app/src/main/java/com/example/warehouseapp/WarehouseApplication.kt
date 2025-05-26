package com.example.warehouseapp

import android.app.Application
import android.content.Context
import android.content.SharedPreferences

object TokenManager {
    private const val PREFS_NAME = "prefs_token"
    private const val KEY_ACCESS_TOKEN = "access_token"
    private const val KEY_USER_ROLE = "user_role"

    private lateinit var prefs: SharedPreferences

    fun init(context: Context) {
        prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    fun saveToken(token: String) {
        prefs.edit().putString(KEY_ACCESS_TOKEN, token).apply()
    }

    fun getToken(): String? = prefs.getString(KEY_ACCESS_TOKEN, null)

    fun clearToken() {
        prefs.edit().remove(KEY_ACCESS_TOKEN).remove(KEY_USER_ROLE).apply()
    }

    // Add role save/get methods:
    fun saveUserRole(role: String) {
        prefs.edit().putString(KEY_USER_ROLE, role).apply()
    }

    fun getUserRole(): String? = prefs.getString(KEY_USER_ROLE, null)
}

class WarehouseApplication : Application(){
    override fun onCreate() {
        super.onCreate()
        TokenManager.init(this)
    }
}