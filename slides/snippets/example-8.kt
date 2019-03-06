enum class Role { Basic, Admin }

data class UserDetails(val name: String)

sealed class User 
data class Basic(val details: UserDetails) : User()
data class Admin(val details: UserDetails) : User() 
object Invalid: User()

fun User.doSomething = when (this) {
  is User.Basic -> println("basic")
  is User.Admin -> println("admin")
  is User.Invalid -> println("oops")
}