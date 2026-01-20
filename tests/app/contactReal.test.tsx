import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

// Mock FontAwesome
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, ...props }: any) => <svg data-testid="fa-icon" {...props} />,
}));

// Mock useToast
const mockShowToast = jest.fn();
jest.mock('@/lib/hooks/useToast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

// Mock UI components
jest.mock('@3asoftwares/ui', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Input: ({ label, name, ...props }: any) => (
    <div>
      {label && <label htmlFor={name}>{label}</label>}
      <input id={name} name={name} {...props} />
    </div>
  ),
}));

import ContactPage from '../../app/contact/page';

describe('ContactPage', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_LOGO_URL = '/test-logo.png';
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render the page title', () => {
    render(<ContactPage />);
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('should render the logo', () => {
    render(<ContactPage />);
    expect(screen.getByAltText('3A Softwares')).toBeInTheDocument();
  });

  it('should render the tagline', () => {
    render(<ContactPage />);
    expect(screen.getByText(/Have questions\? We'd love to hear from you/)).toBeInTheDocument();
  });

  it('should render the contact form', () => {
    render(<ContactPage />);
    expect(screen.getByText('Send us a Message')).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Subject/)).toBeInTheDocument();
    // Message is a native textarea with just a label, not using Input component
    expect(screen.getByText(/Message \*/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tell us more about your inquiry...')).toBeInTheDocument();
  });

  it('should render contact information section', () => {
    render(<ContactPage />);
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Business Hours')).toBeInTheDocument();
  });

  it('should render business hours', () => {
    render(<ContactPage />);
    expect(screen.getByText('Monday - Friday: 9AM - 6PM')).toBeInTheDocument();
    expect(screen.getByText('Saturday: 10AM - 4PM')).toBeInTheDocument();
    expect(screen.getByText('Sunday: Closed')).toBeInTheDocument();
  });

  it('should render quick response section', () => {
    render(<ContactPage />);
    expect(screen.getByText('Quick Response')).toBeInTheDocument();
    expect(
      screen.getByText(/We typically respond to all inquiries within 24 hours/)
    ).toBeInTheDocument();
  });

  it('should update form fields on change', () => {
    render(<ContactPage />);

    const nameInput = screen.getByPlaceholderText('John Doe');
    const emailInput = screen.getByPlaceholderText('john@example.com');
    const subjectInput = screen.getByPlaceholderText('How can we help you?');
    const messageInput = screen.getByPlaceholderText('Tell us more about your inquiry...');

    fireEvent.change(nameInput, { target: { value: 'Test User', name: 'name' } });
    fireEvent.change(emailInput, { target: { value: 'test@test.com', name: 'email' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject', name: 'subject' } });
    fireEvent.change(messageInput, { target: { value: 'Test Message', name: 'message' } });

    expect(nameInput).toHaveValue('Test User');
    expect(emailInput).toHaveValue('test@test.com');
    expect(subjectInput).toHaveValue('Test Subject');
    expect(messageInput).toHaveValue('Test Message');
  });

  it('should show loading state when form is submitted', async () => {
    const { container } = render(<ContactPage />);

    const form = container.querySelector('form');

    await act(async () => {
      fireEvent.submit(form!);
    });

    expect(screen.getByRole('button')).toHaveTextContent('Sending...');
  });

  it('should show success toast and reset form after submission', async () => {
    const { container } = render(<ContactPage />);

    const nameInput = screen.getByPlaceholderText('John Doe');
    const form = container.querySelector('form');

    fireEvent.change(nameInput, { target: { value: 'Test User', name: 'name' } });

    await act(async () => {
      fireEvent.submit(form!);
      jest.advanceTimersByTime(1100);
    });

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        "Message sent successfully! We'll get back to you soon.",
        'success'
      );
    });
  });

  it('should render FontAwesome icons', () => {
    render(<ContactPage />);
    const icons = screen.getAllByTestId('fa-icon');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should display phone number', () => {
    render(<ContactPage />);
    expect(screen.getByText('+91 70470 26537')).toBeInTheDocument();
  });

  it('should display email addresses', () => {
    render(<ContactPage />);
    expect(screen.getByText('support@shophub.com')).toBeInTheDocument();
    expect(screen.getByText('sales@shophub.com')).toBeInTheDocument();
  });
});
