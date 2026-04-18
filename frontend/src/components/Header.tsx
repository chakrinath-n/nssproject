export default function Header() {
  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-sm">
      <div className="w-full">
        <img
          src="/nss-header.png"
          alt="JNTUK NSS Header"
          className="
            w-full 
            h-auto 
            object-contain
            max-h-[140px] 
            sm:max-h-[160px] 
            md:max-h-[180px] 
            lg:max-h-[200px]
          "
        />
      </div>
    </header>
  );
}