import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">🎬 CineApp</h3>
            <p className="text-gray-400">
              Votre plateforme de réservation de places de cinéma en ligne
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-lg">Navigation</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/films" className="hover:text-white transition-colors">
                  Films
                </Link>
              </li>
              <li>
                <Link href="/reservations" className="hover:text-white transition-colors">
                  Réservations
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-lg">Informations</h4>
            <ul className="space-y-2 text-gray-400">
              <li>À propos</li>
              <li>Contact</li>
              <li>CGU</li>
              <li>Politique de confidentialité</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-lg">Suivez-nous</h4>
            <div className="flex gap-4 text-2xl">
              <a href="#" className="hover:text-blue-400 transition-colors">📘</a>
              <a href="#" className="hover:text-blue-400 transition-colors">🐦</a>
              <a href="#" className="hover:text-pink-400 transition-colors">📷</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} CineApp. Tous droits réservés.</p>
          <p className="mt-2 text-sm">Projet de cours - Architecture Réseaux</p>
        </div>
      </div>
    </footer>
  );
}