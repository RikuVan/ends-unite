enum class Role { Basic, Admin }

data class UserDetails(val name: String)

sealed class User 
data class Basic(val details: UserDetails) : User()
data class Admin(val details: UserDetails) : User() 
object Error: User()

when (User) {
  is User.Basic -> println("basic")
  is User.Admin -> println("admin")
  is User.Error -> println("oops")
}