interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary' 
}: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded-md font-medium"
  const variantStyles = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300"
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      {children}
    </button>
  )
} 