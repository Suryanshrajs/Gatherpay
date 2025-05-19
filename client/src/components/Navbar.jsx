"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"

import { Menu, X, Moon, Sun } from "lucide-react"
import { Button } from "./ui/button"
import { useTheme } from "./theme-provider"
import { useAuth } from "../context/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const [showDropdown, setShowDropdown] = useState(false)
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation();
  const currentPath = location.pathname;

  const { isAuthenticated, userInfo, logout } = useAuth()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")
  const toggleDropdown = () => setShowDropdown(prev => !prev)

  const handleLogout = async () => {
    try {
      await logout()
      setShowDropdown(false)
      navigate("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current).contains(event.target)
      ) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showDropdown])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Link to="/" className="font-bold text-xl">
            GatherPay
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {currentPath !== "/" && (
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">Home</Link>
          )}

          {isAuthenticated && (
            <>
              {currentPath !== "/create-event" && (
                <Link
                  to="/create-event"
                  className="text-sm font-medium hover:text-primary"
                  onClick={toggleMenu}
                >
                  Create Event
                </Link>
              )}
              {currentPath !== "/dashboard" && (
                <Link
                  to="/dashboard"
                  className="text-sm font-medium hover:text-primary"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
              )}
            </>
          )}


          {!isAuthenticated ? (
            <>
              {currentPath !== "/login" && (
                <Button variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
              )}
              {currentPath !== "/register" && (
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              )}
            </>
          ) : (
            <div className="relative">
              <Button
                variant="outline"
                onClick={toggleDropdown}
                className="flex items-center gap-2 px-3 py-2 hover:text-primary transition"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                  <AvatarFallback>{userInfo.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{userInfo.name}</span>
              </Button>

              {showDropdown && userInfo && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-10 transform scale-95 transition-all duration-300 ease-out hover:scale-100"
                >
                  <div className="p-4 flex flex-col items-start space-y-2">
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{userInfo.name}</h1>
                    <h2 className="text-sm text-gray-500 dark:text-gray-300 break-words truncate w-full">
                      {userInfo.email}
                    </h2>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 mt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left py-2 px-4 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-red-400 rounded-b-lg transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-background md:hidden" >
            <div ref={dropdownRef} className="fixed w-full inset-y-0 right-0 bg-background p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <Link to="/" className="font-bold text-xl" onClick={toggleMenu}>GatherPay</Link>
                <button
                  className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  onClick={toggleMenu}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-5 bg-background border p-5 rounded-md backdrop-blur flex flex-col gap-4">
                <Link to="/" className="text-sm font-medium hover:text-primary" onClick={toggleMenu}>Home</Link>
                {isAuthenticated && (
                  <>
                    <Link to="/create-event" className="text-sm font-medium hover:text-primary" onClick={toggleMenu}>Create Event</Link>
                    <Link to="/dashboard" className="text-sm font-medium hover:text-primary" onClick={toggleMenu}>Dashboard</Link>
                  </>
                )}

                {!isAuthenticated ? (
                  <>
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/login" onClick={toggleMenu}>Login</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link to="/register" onClick={toggleMenu}>Register</Link>
                    </Button>
                  </>
                ) : (
                  <Button className="w-full" onClick={handleLogout}>Logout</Button>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
