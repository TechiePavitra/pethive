import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccess() {
  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
      <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
      <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Thank you for your purchase. We have received your order and are processing it.
        You can track your order status in your profile or admin dashboard.
      </p>
      <div className="flex gap-4">
        <Link to="/shop">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
