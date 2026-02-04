import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export function Breadcrumbs({ items, className }) {
    return (
        <nav className={cn("flex items-center space-x-2 text-sm text-gray-500", className)}>
            <Link
                href="/"
                className="flex items-center hover:text-[#637D37] transition-colors"
            >
                <Home className="w-4 h-4" />
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="hover:text-[#637D37] transition-colors font-medium"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="font-bold text-gray-900 line-clamp-1 max-w-[200px]">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    )
}
