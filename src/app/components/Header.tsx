// import { Mail, MapPin, Phone } from "lucide-react";
// import Link from "next/link";

// export default function Header() {
//   return (
//     <div className="relative pt-4 px-4 sm:px-16">
//       <div className="flex flex-col md:flex-row justify-between items-start sm:items-center">
//         {/* Logo */}
//         <div className="flex flex-col mb-[25px] sm:mb-0">
//           <Link href="/">
//             <h1 className="font-['Inter'] font-bold text-3xl sm:text-5xl text-white">
//               PEREKUP-PRO
//             </h1>
//             <p className="font-['Inter'] text-sm text-gray-400">
//               Сервис для профессионалов автобизнеса
//             </p>
//           </Link>
//         </div>

//         {/* Contact info */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
//           <div className="flex items-center">
//             <MapPin className="h-5 w-5 mr-2" />
//             <span className="font-['Open_Sans'] font-light text-sm text-white">
//               Украина
//             </span>
//           </div>
//           <a
//             href="mailto:pekekuppro7@gmail.com"
//             className="flex items-center hover:underline"
//           >
//             <Mail className="h-5 w-5 mr-2" />
//             <span className="font-['Open_Sans'] font-light text-sm text-white">
//               pekekuppro7@gmail.com
//             </span>
//           </a>
//           <a
//             href="tel:+380500441132"
//             className="flex items-center hover:underline"
//           >
//             <Phone className="h-5 w-5 mr-2" />
//             <span className="font-['Open_Sans'] font-light text-sm text-white">
//               +38 (050) 044-11-32
//             </span>
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/v1/logout", {
      method: "POST",
    });
    router.replace("/login");
  };

  const hideLogout = pathname === "/login" || pathname === "/subscription";

  return (
    <div className="relative pt-4 px-4 sm:px-16">
      <div className="flex flex-col md:flex-row justify-between items-start sm:items-center">
        {/* Logo */}
        <div className="flex flex-col mb-[25px] sm:mb-0">
          <Link href="/">
            <h1 className="font-['Inter'] font-bold text-3xl sm:text-5xl text-white">
              PEREKUP-PRO
            </h1>
            <p className="font-['Inter'] text-sm text-gray-400">
              Сервис для профессионалов автобизнеса
            </p>
          </Link>
        </div>

        {/* Contact info + Logout */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            <span className="font-['Open_Sans'] font-light text-sm text-white">
              Украина
            </span>
          </div>
          <a
            href="mailto:pekekuppro7@gmail.com"
            className="flex items-center hover:underline"
          >
            <Mail className="h-5 w-5 mr-2" />
            <span className="font-['Open_Sans'] font-light text-sm text-white">
              pekekuppro7@gmail.com
            </span>
          </a>
          <a
            href="tel:+380500441132"
            className="flex items-center hover:underline"
          >
            <Phone className="h-5 w-5 mr-2" />
            <span className="font-['Open_Sans'] font-light text-sm text-white">
              +38 (050) 044-11-32
            </span>
          </a>

          {/* Logout button */}
          {!hideLogout && (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
            >
              Выйти
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
