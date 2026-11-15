import Image from "next/image";
import Link from "next/link";

const footerNavigation = [
  {
    name: "Services",
    href: "#services",
  },
  {
    name: "Our Work",
    href: "#transformations",
  },
  {
    name: "Process",
    href: "#process",
  },
  {
    name: "Location",
    href: "#location",
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#06254B] text-white">
      <div className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16 xl:px-16">
        {/* Main content */}
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_1fr] lg:gap-14">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-4"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white p-1">
                <Image
                  src="/logo.png"
                  alt="Deluxe Shoe Laundry"
                  width={120}
                  height={120}
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <p className="text-sm font-black uppercase tracking-[0.03em]">
                  Deluxe Shoe Laundry
                </p>

                <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.26em] text-[#97C11F]">
                  Stay Fresh. Stay Deluxe.
                </p>
              </div>
            </Link>

            <h2 className="font-heading mt-7 max-w-md text-4xl font-black uppercase leading-[0.9] tracking-[-0.03em] sm:text-5xl">
              Don&apos;t replace.
              <br />

              <span className="text-[#97C11F]">
                Review.
              </span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/55">
              Professional sneaker cleaning, restoration and care
              in Malabe. Real shoes. Real transformations.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="mb-5 text-[9px] font-black uppercase tracking-[0.24em] text-[#97C11F]">
              Explore
            </p>

            <nav className="flex flex-col gap-3">
              {footerNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-white/60 transition-colors duration-300 hover:text-white"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-5 text-[9px] font-black uppercase tracking-[0.24em] text-[#97C11F]">
              Contact
            </p>

            <div className="flex flex-col gap-4">
              <a
                href="https://wa.me/94773560696"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <span className="block text-[8px] font-bold uppercase tracking-[0.16em] text-white/30">
                  WhatsApp
                </span>

                <span className="mt-1 block text-sm font-semibold text-white/70 transition-colors group-hover:text-[#97C11F]">
                  +94 77 356 0696
                </span>
              </a>

              <a
                href="tel:+94767647756"
                className="group"
              >
                <span className="block text-[8px] font-bold uppercase tracking-[0.16em] text-white/30">
                  Call
                </span>

                <span className="mt-1 block text-sm font-semibold text-white/70 transition-colors group-hover:text-[#97C11F]">
                  +94 76 764 7756
                </span>
              </a>

              <a
                href="mailto:deluxeshoelaundry@gmail.com"
                className="group"
              >
                <span className="block text-[8px] font-bold uppercase tracking-[0.16em] text-white/30">
                  Email
                </span>

                <span className="mt-1 block break-all text-sm font-semibold text-white/70 transition-colors group-hover:text-[#97C11F]">
                  deluxeshoelaundry@gmail.com
                </span>
              </a>

              <div>
                <span className="block text-[8px] font-bold uppercase tracking-[0.16em] text-white/30">
                  Location
                </span>

                <p className="mt-1 text-sm font-semibold leading-6 text-white/70">
                  45/3, Isurupura Rd,
                  <br />
                  Malabe, Sri Lanka
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[9px] text-white/30">
            © 2026 Deluxe Shoe Laundry. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">
            <span>Facebook</span>
            <span>Instagram</span>
            <span>TikTok</span>
          </div>

          <p className="text-[9px] text-white/20">
            Developed by Pavithra Chathuramadu
          </p>
        </div>
      </div>
    </footer>
  );
}