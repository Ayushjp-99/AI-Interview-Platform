import { Link } from 'react-router-dom';
import { FiHome, FiAlertCircle } from 'react-icons/fi';

const NotFoundPage = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        padding: 'var(--space-6)',
      }}
    >
      <div className="card card-glass text-center flex-col align-items-center gap-6" style={{ maxWidth: '480px' }}>
        <FiAlertCircle style={{ fontSize: '4rem', color: 'var(--secondary)' }} className="animate-float" />
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>404</h1>
          <h3 className="mt-2">Page Not Found</h3>
          <p className="text-secondary mt-2">
            The path you followed does not exist. Please navigate back to safety.
          </p>
        </div>
        <Link to="/dashboard" className="btn btn-primary">
          Back to Dashboard <FiHome />
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
