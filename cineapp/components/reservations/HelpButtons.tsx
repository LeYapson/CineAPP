'use client';

export default function HelpButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        onClick={() => alert('Fonctionnalité à implémenter')}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
      >
        📧 Nous contacter
      </button>
      <button
        onClick={() => alert('Fonctionnalité à implémenter')}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
      >
        📄 Voir les CGV
      </button>
    </div>
  );
}