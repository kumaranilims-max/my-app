import Image from "next/image";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 font-sans dark:bg-black">
      <header className="w-full bg-white dark:bg-zinc-900 shadow-md py-4 px-4 sm:py-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          <span className="text-xl sm:text-2xl font-bold text-purple-700 dark:text-white">Anil Kumar</span>
        </div>
        <nav className="flex gap-4 sm:gap-6">
          <a href="/" className="text-blue-600 hover:underline font-medium">Home</a>
          <a href="/about" className="text-blue-600 hover:underline font-medium">About</a>
          <a href="/contact" className="text-blue-600 hover:underline font-medium">Contact</a>
        </nav>
      </header>
      <main className="flex flex-col items-center justify-center py-16 px-2 sm:py-32 sm:px-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 sm:p-12 max-w-full sm:max-w-2xl w-full text-center">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-purple-700 dark:text-white mb-4 sm:mb-6">Contact Page</h1>
          <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300">You can contact us at: contact@example.com</p>
        </div>
      </main>
    </div>
  );
}
