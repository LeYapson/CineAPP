import PrivateRoute from '@/components/auth/PrivateRoute';

export const metadata = {
  title: 'Mes commandes - CineApp',
  description: 'Consultez l\'historique de vos commandes',
};

function OrdersContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mes commandes</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            Vous n'avez pas encore passé de commandes.
          </p>
          <a
            href="/films"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Découvrir les films
          </a>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <PrivateRoute>
      <OrdersContent />
    </PrivateRoute>
  );
}