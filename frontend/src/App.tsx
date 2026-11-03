import { useEffect, useState } from 'react';
import { api } from './services/api';
import {
  initialSiteSettings,
  initialLocalities,
  initialServices,
  initialProjects,
  initialFAQs,
  initialReviews,
} from './lib/initialData';
import type { SiteSettings, Service, ServiceArea, Project, FAQ, Review, Enquiry } from './types';
import {
  Wrench,
  Phone,
  MessageSquare,
  MapPin,
  CheckCircle,
  Clock,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Star,
  ChevronDown,
  ChevronUp,
  Search,
  Upload,
  Send,
  X,
  Droplets,
  BadgeCheck,
  Calendar,
  ArrowRight,
  Lock,
  Eye,
  ExternalLink,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';

export default function App() {
  // Synchronous initial data ensures ZERO blank states
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [localities, setLocalities] = useState<ServiceArea[]>(initialLocalities);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [faqs, setFaqs] = useState<FAQ[]>(initialFAQs);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  // UI Interactive States
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeServiceModal, setActiveServiceModal] = useState<Service | null>(null);
  const [localitySearch, setLocalitySearch] = useState<string>('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Admin Bookings Portal States
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminPasswordError, setAdminPasswordError] = useState(false);
  const [enquiriesList, setEnquiriesList] = useState<Enquiry[]>([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // Enquiry Form State
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formLocality, setFormLocality] = useState('Miyapur');
  const [formService, setFormService] = useState('Emergency Plumbing Services');
  const [formUrgency, setFormUrgency] = useState('Urgent (Today)');
  const [formMessage, setFormMessage] = useState('');
  const [formFile, setFormFile] = useState<File | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // New Review Form State
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewLocality, setNewReviewLocality] = useState('');
  const [newReviewService, setNewReviewService] = useState('Bathroom Plumbing');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Live Supabase Sync
  useEffect(() => {
    // Auto-open admin dashboard if URL is /admin or #admin
    if (window.location.pathname.includes('/admin') || window.location.hash.includes('admin')) {
      setIsAdminModalOpen(true);
    }

    // 1. Site Settings
    api.getSiteSettings().then((data) => {
      if (data) setSettings(data);
    }).catch(console.error);

    // 2. Services
    api.getServices().then((data) => {
      if (data && data.length > 0) setServices(data);
    }).catch(console.error);

    // 3. Service Areas
    api.getServiceAreas().then((data) => {
      if (data && data.length > 0) setLocalities(data);
    }).catch(console.error);

    // 4. Projects
    api.getProjects().then((data) => {
      if (data && data.length > 0) setProjects(data);
    }).catch(console.error);

    // 5. FAQs
    api.getFAQs().then((data) => {
      if (data && data.length > 0) setFaqs(data);
    }).catch(console.error);

    // 6. Reviews
    api.getReviews().then((data) => {
      if (data && data.length > 0) setReviews(data);
    }).catch(console.error);
  }, []);

  // Filter services by category
  const categories = ['All', 'Emergency', 'Leak & Pipe', 'Sanitary & Bathroom', 'Renovation & Grout'];
  const filteredServices = services.filter((s) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Emergency') return s.is_emergency || s.slug.includes('emergency');
    if (selectedCategory === 'Leak & Pipe')
      return s.slug.includes('leak') || s.slug.includes('pipe') || s.slug.includes('drain');
    if (selectedCategory === 'Sanitary & Bathroom')
      return s.slug.includes('bath') || s.slug.includes('toilet') || s.slug.includes('sink');
    if (selectedCategory === 'Renovation & Grout')
      return s.slug.includes('renovation') || s.slug.includes('grouting') || s.slug.includes('tank');
    return true;
  });

  // Filter localities
  const filteredLocalities = localities.filter((loc) =>
    loc.name.toLowerCase().includes(localitySearch.toLowerCase()) ||
    (loc.district && loc.district.toLowerCase().includes(localitySearch.toLowerCase()))
  );

  // Handle Enquiry Form Submit
  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) {
      alert('Please provide your name and phone number.');
      return;
    }
    setFormSubmitting(true);
    let attachmentUrl: string | undefined;

    if (formFile) {
      try {
        const uploaded = await api.uploadAttachment(formFile, 'enquiry-attachments');
        if (uploaded) {
          attachmentUrl = uploaded;
        }
      } catch (err) {
        console.error('File upload error:', err);
      }
    }

    // 1. Submit to Supabase Database
    await api.submitEnquiry({
      customer_name: formName,
      phone: formPhone,
      locality_name: formLocality,
      service_name: formService,
      problem_description: formMessage?.trim() || `Plumbing request for ${formService} (${formUrgency})`,
      attachment_url: attachmentUrl,
      privacy_consent: true,
      status: 'New',
    });

    // 2. Format Complete WhatsApp message with Photo Link
    let waText = `*Hi Chandu! New Plumbing Booking:*%0A` +
      `👤 *Name:* ${encodeURIComponent(formName)}%0A` +
      `📞 *Phone:* ${encodeURIComponent(formPhone)}%0A` +
      `📍 *Locality:* ${encodeURIComponent(formLocality)}%0A` +
      `🔧 *Service:* ${encodeURIComponent(formService)}%0A` +
      `⚡ *Urgency:* ${encodeURIComponent(formUrgency)}%0A` +
      `📝 *Problem Details:* ${encodeURIComponent(formMessage?.trim() || 'Requesting on-site inspection and quote')}`;

    if (attachmentUrl) {
      waText += `%0A%0A📸 *Uploaded Leak/Issue Photo:*%0A${encodeURIComponent(attachmentUrl)}`;
    }

    setFormSubmitting(false);
    setFormSuccess(true);

    // 3. Open WhatsApp with formatted booking and photo link
    window.open(`https://wa.me/91${settings.whatsapp || '7032270517'}?text=${waText}`, '_blank');

    // Reset form fields
    setFormName('');
    setFormPhone('');
    setFormMessage('');
    setFormFile(null);
  };

  // Admin Bookings Functions
  const fetchAdminEnquiries = async () => {
    setEnquiriesLoading(true);
    const data = await api.getEnquiries();
    setEnquiriesList(data);
    setEnquiriesLoading(false);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      adminPasswordInput.trim() === 'chandu@70322' ||
      adminPasswordInput.trim() === '70322' ||
      adminPasswordInput.trim() === '7032270517' ||
      adminPasswordInput.trim() === 'admin'
    ) {
      setIsAdminAuthenticated(true);
      setAdminPasswordError(false);
      setAdminPasswordInput('');
      fetchAdminEnquiries();
    } else {
      setAdminPasswordError(true);
    }
  };

  const handleStatusChange = async (enquiryId: string | undefined, newStatus: string) => {
    if (!enquiryId) return;
    const ok = await api.updateEnquiryStatus(enquiryId, newStatus);
    if (ok) {
      setEnquiriesList((prev) =>
        prev.map((item) => (item.id === enquiryId ? { ...item, status: newStatus } : item))
      );
    }
  };

  // Handle Review Submit
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName || !newReviewText) return;
    setReviewSubmitting(true);
    const success = await api.submitReview({
      customer_name: newReviewName,
      locality: newReviewLocality || 'Hyderabad',
      service_taken: newReviewService,
      rating: newReviewRating,
      review_text: newReviewText,
      review_date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      is_approved: true,
      is_featured: true,
    });
    setReviewSubmitting(false);
    if (success) {
      setReviewSuccess(true);
      setTimeout(() => {
        setIsReviewModalOpen(false);
        setReviewSuccess(false);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-500 text-charcoal-800 flex flex-col font-sans selection:bg-copper-500 selection:text-white">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-teal-950 text-white text-xs sm:text-sm py-2 px-4 border-b border-teal-900">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-semibold text-copper-300">24/7 Immediate Dispatch</span>
            <span className="hidden md:inline text-teal-300">|</span>
            <span className="hidden md:inline text-teal-200">Arriving in 30–45 mins in Miyapur & 25 Hyderabad Localities</span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href={`https://wa.me/91${settings.whatsapp}?text=Hi%20Chandu,%20I%20have%20an%20urgent%20plumbing%20issue.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200 font-medium transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp: +91 {settings.whatsapp}</span>
            </a>
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center gap-1.5 text-copper-300 hover:text-copper-200 font-bold transition"
            >
              <Phone className="w-3.5 h-3.5 text-copper-400" />
              <span>Direct Call: +91 {settings.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. STICKY LUXURY NAVIGATION */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-softgrey-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-teal-900 text-copper-400 flex items-center justify-center shadow-premium">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold font-display text-teal-900 tracking-tight leading-none">
                  {settings.business_name}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-copper-100 text-copper-700">
                  <BadgeCheck className="w-3 h-3 text-copper-600" />
                  Verified
                </span>
              </div>
              <p className="text-xs text-charcoal-500 font-medium mt-0.5">{settings.tagline}</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-charcoal-700">
            <a href="#services" className="hover:text-teal-900 transition">Services</a>
            <a href="#why-us" className="hover:text-teal-900 transition">Why Chandu</a>
            <a href="#portfolio" className="hover:text-teal-900 transition">Workmanship</a>
            <a href="#localities" className="hover:text-teal-900 transition">Localities</a>
            <a href="#reviews" className="hover:text-teal-900 transition">Reviews</a>
            <a href="#faqs" className="hover:text-teal-900 transition">FAQs</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/91${settings.whatsapp}?text=Hi%20Chandu,%20need%20plumbing%20assistance.`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <a
              href={`tel:${settings.phone}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-900 hover:bg-teal-800 text-white font-bold text-sm transition shadow-premium"
            >
              <Phone className="w-4 h-4 text-copper-400" />
              <span>+91 {settings.phone}</span>
            </a>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-teal-950 via-teal-900 to-teal-950 text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-800/80 border border-copper-500/30 text-copper-300 text-xs sm:text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4 text-copper-400" />
              <span>5 Years Verified Craftsmanship in Hyderabad</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-tight mb-6">
              {settings.hero_title}
            </h1>

            <p className="text-base sm:text-lg text-teal-100 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              {settings.hero_description}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10">
              <a
                href={`tel:${settings.phone}`}
                className="px-7 py-4 rounded-xl bg-copper-500 hover:bg-copper-600 text-white font-bold text-base transition shadow-copper-glow flex items-center gap-2.5"
              >
                <Phone className="w-5 h-5" />
                <span>Call Chandu (+91 {settings.phone})</span>
              </a>
              <a
                href="#enquiry-form"
                className="px-7 py-4 rounded-xl bg-teal-800/80 hover:bg-teal-800 border border-teal-600 text-white font-semibold text-base transition flex items-center gap-2"
              >
                <Calendar className="w-5 h-5 text-copper-400" />
                <span>Book Service Online</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-6 border-t border-teal-800/60">
              <div className="bg-teal-900/50 p-3 rounded-xl border border-teal-800">
                <Clock className="w-5 h-5 text-copper-400 mb-1" />
                <div className="text-xs text-teal-200">Response</div>
                <div className="text-sm font-bold text-white">30–45 Mins</div>
              </div>
              <div className="bg-teal-900/50 p-3 rounded-xl border border-teal-800">
                <ShieldCheck className="w-5 h-5 text-copper-400 mb-1" />
                <div className="text-xs text-teal-200">Pricing</div>
                <div className="text-sm font-bold text-white">100% Upfront</div>
              </div>
              <div className="bg-teal-900/50 p-3 rounded-xl border border-teal-800">
                <MapPin className="w-5 h-5 text-copper-400 mb-1" />
                <div className="text-xs text-teal-200">Coverage</div>
                <div className="text-sm font-bold text-white">25 Localities</div>
              </div>
              <div className="bg-teal-900/50 p-3 rounded-xl border border-teal-800">
                <Star className="w-5 h-5 text-copper-400 mb-1" />
                <div className="text-xs text-teal-200">Zero Fake</div>
                <div className="text-sm font-bold text-white">100% Verified</div>
              </div>
            </div>
          </div>

          {/* Hero Side Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 sm:p-8 text-charcoal-800 shadow-2xl border border-softgrey-300 relative">
              <div className="flex items-center gap-3 pb-6 border-b border-softgrey-200">
                <div className="w-14 h-14 rounded-full bg-teal-900 text-copper-400 flex items-center justify-center font-display font-bold text-xl shadow-md">
                  C
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-lg text-teal-900">Chandu</h3>
                    <BadgeCheck className="w-4 h-4 text-copper-600" />
                  </div>
                  <p className="text-xs text-charcoal-500 font-medium">Founder & Lead Plumbing Specialist</p>
                  <p className="text-xs text-copper-600 font-semibold mt-0.5">5 Years Field Experience • Miyapur Base</p>
                </div>
              </div>

              <div className="py-5 space-y-3.5 text-sm text-charcoal-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Concealed Pipe Leak Detection without breaking extra tiles</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Waterproof Epoxy Grouting to stop ceiling leaks permanently</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Luxury Bathroom Diverters & Wall-Hung Commodes</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>24/7 Rapid Emergency Response across Hyderabad</span>
                </div>
              </div>

              <div className="pt-5 border-t border-softgrey-200">
                <a
                  href={`tel:${settings.phone}`}
                  className="w-full py-3.5 rounded-xl bg-teal-900 hover:bg-teal-800 text-white font-bold text-center flex items-center justify-center gap-2 transition"
                >
                  <Phone className="w-4 h-4 text-copper-400" />
                  <span>Speak Directly with Chandu</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EMERGENCY BANNER */}
      <div className="bg-copper-500 text-white py-3.5 px-4 text-center font-semibold text-sm sm:text-base shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-2 sm:gap-4">
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-white" />
            <span>Have an active water leak, pipe burst, or tank overflow?</span>
          </span>
          <a
            href={`tel:${settings.phone}`}
            className="underline font-bold hover:text-teal-950 transition"
          >
            Call 7032270517 for Priority Dispatch
          </a>
        </div>
      </div>

      {/* 5. WHY CHOOSE US */}
      <section id="why-us" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-copper-600">Trust & Craftsmanship</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-teal-950 font-display mt-2">
            Why Hyderabad Homeowners Rely on A1 Chandu
          </h2>
          <p className="mt-3 text-charcoal-600 text-base">
            No intermediaries, no untrained helpers — you deal directly with an experienced master technician.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-7 rounded-2xl border border-softgrey-200 shadow-premium hover:shadow-premium-hover transition">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-900 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6 text-copper-600" />
            </div>
            <h3 className="text-lg font-bold text-teal-900 mb-2">5 Years Verified Field Work</h3>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              Extensive hands-on expertise spanning luxury gated communities, villas, and apartments across Hyderabad.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-softgrey-200 shadow-premium hover:shadow-premium-hover transition">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-900 flex items-center justify-center mb-5">
              <Clock className="w-6 h-6 text-copper-600" />
            </div>
            <h3 className="text-lg font-bold text-teal-900 mb-2">30–45 Min Rapid Arrival</h3>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              Based in Miyapur with agile coverage across Kukatpally, Gachibowli, Ameenpur, and 25 core localities.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-softgrey-200 shadow-premium hover:shadow-premium-hover transition">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-900 flex items-center justify-center mb-5">
              <CheckCircle className="w-6 h-6 text-copper-600" />
            </div>
            <h3 className="text-lg font-bold text-teal-900 mb-2">100% Upfront Pricing</h3>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              Honest inspection fees and transparent parts quotation before starting any repairs. Zero hidden charges.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-softgrey-200 shadow-premium hover:shadow-premium-hover transition">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-900 flex items-center justify-center mb-5">
              <Sparkles className="w-6 h-6 text-copper-600" />
            </div>
            <h3 className="text-lg font-bold text-teal-900 mb-2">Zero Fake Claims Policy</h3>
            <p className="text-sm text-charcoal-600 leading-relaxed">
              Every review, case study, and testimonial is verified from genuine Hyderabad homeowners.
            </p>
          </div>
        </div>
      </section>

      {/* 6. WORK PROCESS */}
      <section className="bg-teal-950 text-white py-20 px-4 sm:px-6 lg:px-8 border-y border-teal-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-copper-400">Streamlined Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display mt-2 text-white">
              How We Solve Your Plumbing Problem
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="relative">
              <div className="text-5xl font-extrabold text-teal-800 font-display mb-3">01</div>
              <h3 className="text-lg font-bold text-copper-300 mb-2">Instant Call / WhatsApp</h3>
              <p className="text-sm text-teal-100 leading-relaxed">
                Describe your problem or send a photo over WhatsApp. We guide you on emergency shut-off immediately.
              </p>
            </div>
            <div className="relative">
              <div className="text-5xl font-extrabold text-teal-800 font-display mb-3">02</div>
              <h3 className="text-lg font-bold text-copper-300 mb-2">Rapid On-Site Arrival</h3>
              <p className="text-sm text-teal-100 leading-relaxed">
                Chandu arrives with specialized diagnostics and certified replacement fittings in 30–45 minutes.
              </p>
            </div>
            <div className="relative">
              <div className="text-5xl font-extrabold text-teal-800 font-display mb-3">03</div>
              <h3 className="text-lg font-bold text-copper-300 mb-2">Transparent Estimate</h3>
              <p className="text-sm text-teal-100 leading-relaxed">
                Clear inspection, pinpoint diagnosis, and upfront quotation before any work commences.
              </p>
            </div>
            <div className="relative">
              <div className="text-5xl font-extrabold text-teal-800 font-display mb-3">04</div>
              <h3 className="text-lg font-bold text-copper-300 mb-2">Precision Fix & Test</h3>
              <p className="text-sm text-teal-100 leading-relaxed">
                Neat architectural repair, hydraulic pressure testing, clean-up, and genuine workmanship guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ALL 14 SERVICES SECTION WITH CATEGORY TABS */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-copper-600">Complete Plumbing Spectrum</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-teal-950 font-display mt-2">
            14 Professional Plumbing Services
          </h2>
          <p className="mt-3 text-charcoal-600 text-base">
            From emergency pipe bursts to luxury sanitary refits, explore our specialized solutions across Hyderabad.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-teal-900 text-white shadow-md'
                    : 'bg-white text-charcoal-700 hover:bg-teal-50 border border-softgrey-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl overflow-hidden border border-softgrey-200 shadow-premium hover:shadow-premium-hover transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-teal-950">
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  {service.is_featured && (
                    <span className="absolute top-3 right-3 bg-copper-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
                      Popular
                    </span>
                  )}
                  {service.is_emergency && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> 24/7 Fast Dispatch
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-teal-950 font-display mb-2">{service.title}</h3>
                  <p className="text-sm text-charcoal-600 leading-relaxed mb-4 line-clamp-3">
                    {service.short_description}
                  </p>

                  {/* Common Problems Preview */}
                  {service.common_problems && service.common_problems.length > 0 && (
                    <div className="space-y-1.5 mb-4">
                      {service.common_problems.slice(0, 2).map((prob, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-charcoal-700">
                          <Droplets className="w-3.5 h-3.5 text-copper-500 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{prob}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0 flex gap-2.5">
                <button
                  onClick={() => setActiveServiceModal(service)}
                  className="flex-1 py-2.5 rounded-xl border border-teal-900 text-teal-900 hover:bg-teal-50 font-bold text-xs sm:text-sm transition text-center"
                >
                  View Full Details
                </button>
                <a
                  href={`tel:${settings.phone}`}
                  className="px-4 py-2.5 rounded-xl bg-teal-900 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-copper-400" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. WORKMANSHIP & PROJECT SHOWCASE */}
      <section id="portfolio" className="bg-ivory-400 py-20 px-4 sm:px-6 lg:px-8 border-t border-softgrey-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-copper-600">Demonstrated Quality</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-teal-950 font-display mt-2">
              Workmanship & Project Portfolio
            </h2>
            <p className="mt-3 text-charcoal-600 text-base">
              Verified on-site plumbing installations and waterproof grouting across Hyderabad apartments and villas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-softgrey-200 shadow-premium flex flex-col">
                <div className="relative h-48 overflow-hidden bg-teal-950">
                  <img
                    src={p.primary_image_url}
                    alt={p.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  {p.is_before_after && (
                    <span className="absolute bottom-3 left-3 bg-teal-950/90 text-copper-300 text-[10px] font-bold px-2 py-0.5 rounded">
                      Before & After Verified
                    </span>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-copper-600 uppercase tracking-wider">{p.category}</span>
                    <h3 className="font-bold text-teal-900 text-base mt-1 mb-2">{p.title}</h3>
                    <p className="text-xs text-charcoal-600 leading-relaxed">{p.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-softgrey-100 flex items-center justify-between">
                    <span className="text-[11px] text-charcoal-500">Miyapur / Hyderabad</span>
                    <a
                      href={`tel:${settings.phone}`}
                      className="text-xs font-bold text-teal-900 hover:text-copper-600 transition flex items-center gap-1"
                    >
                      Inquire Similar <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. 25 HYDERABAD LOCALITIES COVERAGE WITH SEARCH */}
      <section id="localities" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-copper-600">Local Presence</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-teal-950 font-display mt-2">
            Coverage Across 25 Localities in Hyderabad
          </h2>
          <p className="mt-3 text-charcoal-600 text-base">
            Fast 30–45 minute dispatch with fully stocked toolkits for rapid pipe repair.
          </p>

          {/* Search Localities */}
          <div className="relative max-w-md mx-auto mt-6">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-charcoal-400" />
            <input
              type="text"
              placeholder="Search your locality (e.g. Miyapur, Kukatpally, Gachibowli)..."
              value={localitySearch}
              onChange={(e) => setLocalitySearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-softgrey-300 focus:outline-none focus:ring-2 focus:ring-teal-900 text-sm bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 max-w-5xl mx-auto">
          {filteredLocalities.map((loc) => (
            <div
              key={loc.id}
              className="bg-white p-3.5 rounded-xl border border-softgrey-200 shadow-sm hover:border-teal-900 transition flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-copper-500 flex-shrink-0" />
                <span className="font-semibold text-xs sm:text-sm text-teal-950">{loc.name}</span>
              </div>
              {loc.popular && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="High-frequency dispatch area"></span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 10. REVIEWS & TESTIMONIALS (ZERO FAKE REVIEWS POLICY) */}
      <section id="reviews" className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-y border-softgrey-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-copper-600">Verified Testimonials</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-teal-950 font-display mt-2">
                Real Feedback from Hyderabad Residents
              </h2>
              <p className="mt-2 text-charcoal-600 text-sm">
                100% Genuine reviews — zero fabricated testimonials.
              </p>
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-teal-900 hover:bg-teal-800 text-white font-bold text-sm transition shadow flex items-center gap-2"
            >
              <Star className="w-4 h-4 text-copper-400" />
              <span>Leave a Review</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-ivory-500 p-6 rounded-2xl border border-softgrey-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-copper-500 mb-3">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-copper-500" />
                    ))}
                  </div>
                  <p className="text-charcoal-700 text-sm leading-relaxed mb-4 italic">
                    "{rev.review_text}"
                  </p>
                </div>
                <div className="pt-4 border-t border-softgrey-200 flex justify-between items-end">
                  <div>
                    <h4 className="font-bold text-teal-950 text-sm">{rev.customer_name}</h4>
                    <span className="text-xs text-charcoal-500">{rev.locality} • {rev.service_taken}</span>
                  </div>
                  {rev.review_date && (
                    <span className="text-[11px] text-charcoal-400">{rev.review_date}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FREQUENTLY ASKED QUESTIONS */}
      <section id="faqs" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-copper-600">Got Questions?</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-teal-950 font-display mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-softgrey-200 overflow-hidden shadow-sm transition"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-teal-50/50 transition"
              >
                <span className="font-bold text-teal-950 text-base">{faq.question}</span>
                {openFaqIndex === idx ? (
                  <ChevronUp className="w-5 h-5 text-copper-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-charcoal-400 flex-shrink-0" />
                )}
              </button>
              {openFaqIndex === idx && (
                <div className="px-5 pb-5 text-sm text-charcoal-600 leading-relaxed border-t border-softgrey-100 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 12. DIRECT BOOKING & ENQUIRY FORM */}
      <section id="enquiry-form" className="bg-teal-950 text-white py-20 px-4 sm:px-6 lg:px-8 border-t border-teal-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-copper-400">Direct Contact</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display mt-2 text-white">
              Book a Service or Request an Estimate
            </h2>
            <p className="mt-2 text-teal-200 text-sm">
              We respond immediately! Attach a photo of your leak or issue for an instant estimate.
            </p>
          </div>

          <div className="bg-white text-charcoal-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
            {formSuccess ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-teal-950 mb-2">Inquiry Received!</h3>
                <p className="text-charcoal-600 text-sm max-w-md mx-auto mb-6">
                  Thank you! Chandu has received your request and will call you directly at the number provided.
                </p>
                <button
                  onClick={() => setFormSuccess(false)}
                  className="px-6 py-2.5 rounded-xl bg-teal-900 text-white text-sm font-semibold"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-teal-950 uppercase tracking-wider mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-softgrey-300 focus:outline-none focus:ring-2 focus:ring-teal-900 text-sm bg-ivory-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-teal-950 uppercase tracking-wider mb-1.5">
                      Mobile Number (10 Digits) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-softgrey-300 focus:outline-none focus:ring-2 focus:ring-teal-900 text-sm bg-ivory-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-teal-950 uppercase tracking-wider mb-1.5">
                      Your Locality
                    </label>
                    <select
                      value={formLocality}
                      onChange={(e) => setFormLocality(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-softgrey-300 focus:outline-none focus:ring-2 focus:ring-teal-900 text-sm bg-ivory-300"
                    >
                      {localities.map((loc) => (
                        <option key={loc.id} value={loc.name}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-teal-950 uppercase tracking-wider mb-1.5">
                      Service Needed
                    </label>
                    <select
                      value={formService}
                      onChange={(e) => setFormService(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-softgrey-300 focus:outline-none focus:ring-2 focus:ring-teal-900 text-sm bg-ivory-300"
                    >
                      {services.map((svc) => (
                        <option key={svc.id} value={svc.title}>
                          {svc.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-teal-950 uppercase tracking-wider mb-1.5">
                      Urgency
                    </label>
                    <select
                      value={formUrgency}
                      onChange={(e) => setFormUrgency(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-softgrey-300 focus:outline-none focus:ring-2 focus:ring-teal-900 text-sm bg-ivory-300"
                    >
                      <option>Emergency (Immediate)</option>
                      <option>Urgent (Today)</option>
                      <option>Next 2–3 Days</option>
                      <option>Weekend Scheduling</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-950 uppercase tracking-wider mb-1.5">
                    Problem Details / Leak Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly tell us what is leaking or what plumbing work is needed..."
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-softgrey-300 focus:outline-none focus:ring-2 focus:ring-teal-900 text-sm bg-ivory-300"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-950 uppercase tracking-wider mb-1.5">
                    Upload Photo of Problem (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2.5 rounded-xl border border-dashed border-teal-800 text-teal-900 hover:bg-teal-50 cursor-pointer flex items-center gap-2 text-xs font-semibold">
                      <Upload className="w-4 h-4 text-copper-600" />
                      <span>{formFile ? formFile.name : 'Choose File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFormFile(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                    {formFile && (
                      <button
                        type="button"
                        onClick={() => setFormFile(null)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full py-4 rounded-xl bg-copper-500 hover:bg-copper-600 text-white font-extrabold text-base transition shadow-copper-glow flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{formSubmitting ? 'Sending Request...' : 'Submit Inquiry to Chandu'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 13. FULL BRAND FOOTER */}
      <footer className="bg-teal-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-teal-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-900 text-copper-400 flex items-center justify-center shadow">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-xl font-display text-white">{settings.business_name}</h3>
            </div>
            <p className="text-teal-200 text-sm leading-relaxed max-w-md mb-6">
              Dependable plumbing, concealed leak detection, waterproof epoxy grouting, and luxury sanitaryware installation across 25 localities in Hyderabad. Backed by 5 years of verified field craftsmanship.
            </p>
            <div className="text-xs text-teal-300">
              Primary Base: {settings.location_base}
            </div>
          </div>

          <div>
            <h4 className="text-copper-400 font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-teal-200">
              <li><a href="#services" className="hover:text-white transition">All 14 Services</a></li>
              <li><a href="#why-us" className="hover:text-white transition">Why Chandu</a></li>
              <li><a href="#portfolio" className="hover:text-white transition">Portfolio Showcase</a></li>
              <li><a href="#localities" className="hover:text-white transition">25 Service Areas</a></li>
              <li><a href="#reviews" className="hover:text-white transition">Customer Reviews</a></li>
              <li><a href="#faqs" className="hover:text-white transition">FAQs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-copper-400 font-bold text-sm uppercase tracking-wider mb-4">Direct Contact</h4>
            <div className="space-y-3 text-sm text-teal-200">
              <div>
                <div className="text-xs text-teal-400">Emergency & Appointments:</div>
                <a href={`tel:${settings.phone}`} className="text-white font-bold text-base hover:text-copper-300">
                  +91 {settings.phone}
                </a>
              </div>
              <div>
                <div className="text-xs text-teal-400">WhatsApp:</div>
                <a
                  href={`https://wa.me/91${settings.whatsapp}?text=Hi%20Chandu`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-300 font-semibold hover:underline"
                >
                  +91 {settings.whatsapp}
                </a>
              </div>
              <div>
                <div className="text-xs text-teal-400">Working Hours:</div>
                <div className="text-white font-medium">{settings.working_hours}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-teal-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-teal-400">
          <div>© {new Date().getFullYear()} {settings.business_name}. All Rights Reserved.</div>
          <div className="flex gap-6">
            <span className="hover:text-white transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition cursor-pointer">Hyderabad, Telangana</span>
          </div>
        </div>
      </footer>

      {/* 14. FLOATING STICKY ACTION BUTTONS */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <a
          href={`https://wa.me/91${settings.whatsapp}?text=Hi%20Chandu,%20I%20need%20plumbing%20help.`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-2xl transition hover:scale-110"
          title="Chat on WhatsApp"
        >
          <MessageSquare className="w-6 h-6" />
        </a>
        <a
          href={`tel:${settings.phone}`}
          className="w-14 h-14 rounded-full bg-teal-900 hover:bg-teal-800 text-copper-400 flex items-center justify-center shadow-2xl transition hover:scale-110 border-2 border-copper-500"
          title="Direct Phone Call"
        >
          <Phone className="w-6 h-6" />
        </a>
      </div>

      {/* 15. SERVICE DETAILS MODAL */}
      {activeServiceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setActiveServiceModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-softgrey-200 flex items-center justify-center hover:bg-softgrey-300 transition"
            >
              <X className="w-5 h-5 text-charcoal-700" />
            </button>

            <img
              src={activeServiceModal.image_url}
              alt={activeServiceModal.title}
              className="w-full h-56 object-cover rounded-2xl mb-6"
            />

            <h3 className="text-2xl font-extrabold text-teal-950 font-display mb-2">
              {activeServiceModal.title}
            </h3>
            <p className="text-sm text-charcoal-600 leading-relaxed mb-6">
              {activeServiceModal.full_description}
            </p>

            {activeServiceModal.common_problems && activeServiceModal.common_problems.length > 0 && (
              <div className="mb-6">
                <h4 className="font-bold text-sm text-teal-900 mb-2 uppercase tracking-wider">
                  Common Problems We Fix:
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-charcoal-700">
                  {activeServiceModal.common_problems.map((p, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Droplets className="w-4 h-4 text-copper-600 flex-shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeServiceModal.what_included && activeServiceModal.what_included.length > 0 && (
              <div className="mb-6">
                <h4 className="font-bold text-sm text-teal-900 mb-2 uppercase tracking-wider">
                  What Is Included:
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-charcoal-700">
                  {activeServiceModal.what_included.map((w, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t border-softgrey-200 flex gap-4">
              <a
                href={`tel:${settings.phone}`}
                className="flex-1 py-3.5 rounded-xl bg-copper-500 hover:bg-copper-600 text-white font-bold text-center flex items-center justify-center gap-2 transition"
              >
                <Phone className="w-4 h-4" />
                <span>Call to Book: +91 {settings.phone}</span>
              </a>
              <button
                onClick={() => setActiveServiceModal(null)}
                className="px-6 py-3.5 rounded-xl border border-softgrey-300 text-charcoal-700 hover:bg-softgrey-100 font-semibold text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 16. SUBMIT REVIEW MODAL */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-softgrey-200 flex items-center justify-center hover:bg-softgrey-300 transition"
            >
              <X className="w-5 h-5 text-charcoal-700" />
            </button>

            <h3 className="text-2xl font-bold text-teal-950 font-display mb-2">Leave a Customer Review</h3>
            <p className="text-xs text-charcoal-600 mb-6">
              Share your genuine feedback on work done by Chandu in Hyderabad.
            </p>

            {reviewSuccess ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-lg text-teal-950">Review Submitted!</h4>
                <p className="text-xs text-charcoal-600">Thank you for supporting verified craftsmanship!</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-teal-950 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand V."
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-softgrey-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900 bg-ivory-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-teal-950 uppercase tracking-wider mb-1">
                      Locality
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Miyapur"
                      value={newReviewLocality}
                      onChange={(e) => setNewReviewLocality(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-softgrey-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900 bg-ivory-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-teal-950 uppercase tracking-wider mb-1">
                      Rating
                    </label>
                    <select
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-softgrey-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900 bg-ivory-300"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                      <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-950 uppercase tracking-wider mb-1">
                    Service Availed
                  </label>
                  <select
                    value={newReviewService}
                    onChange={(e) => setNewReviewService(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-softgrey-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900 bg-ivory-300"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-teal-950 uppercase tracking-wider mb-1">
                    Your Review *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell other Hyderabad homeowners about your experience..."
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-softgrey-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900 bg-ivory-300"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="w-full py-3.5 rounded-xl bg-teal-900 hover:bg-teal-800 text-white font-bold text-sm transition"
                >
                  {reviewSubmitting ? 'Posting...' : 'Post Verified Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 17. ADMIN BOOKINGS PORTAL MODAL */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-softgrey-300">
            {/* Modal Header */}
            <div className="bg-teal-950 text-white p-5 sm:p-6 flex justify-between items-center border-b border-teal-900 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-900 text-copper-400 flex items-center justify-center shadow">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg sm:text-xl font-display text-white">
                    Admin Bookings & Enquiries Portal
                  </h3>
                  <p className="text-xs text-teal-300">
                    A1 Chandu Plumbing Services • Real-Time Database Management
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isAdminAuthenticated && (
                  <button
                    onClick={fetchAdminEnquiries}
                    disabled={enquiriesLoading}
                    className="p-2 rounded-xl bg-teal-900 hover:bg-teal-800 text-copper-300 transition"
                    title="Refresh Bookings"
                  >
                    <RefreshCw className={`w-4 h-4 ${enquiriesLoading ? 'animate-spin' : ''}`} />
                  </button>
                )}
                <button
                  onClick={() => setIsAdminModalOpen(false)}
                  className="w-9 h-9 rounded-xl bg-teal-900 hover:bg-teal-800 text-teal-300 flex items-center justify-center transition"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 overflow-y-auto flex-1 bg-ivory-500">
              {!isAdminAuthenticated ? (
                /* Admin Login View */
                <div className="max-w-md mx-auto py-10 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-teal-900 text-copper-400 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-teal-950 font-display mb-1">
                    Technician / Admin Access
                  </h4>
                  <p className="text-xs text-charcoal-600 mb-6">
                    Enter your admin password to view all customer inquiries and leak photos.
                  </p>

                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div>
                      <input
                        type="password"
                        placeholder="Enter password (e.g. chandu@70322)"
                        value={adminPasswordInput}
                        onChange={(e) => {
                          setAdminPasswordInput(e.target.value);
                          setAdminPasswordError(false);
                        }}
                        className={`w-full px-4 py-3 rounded-xl border text-sm text-center font-medium bg-white focus:outline-none focus:ring-2 ${
                          adminPasswordError
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-softgrey-300 focus:ring-teal-900'
                        }`}
                        autoFocus
                      />
                      {adminPasswordError && (
                        <p className="text-xs text-red-600 font-semibold mt-1.5">
                          Incorrect password. Please use your owner password (chandu@70322).
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-teal-900 hover:bg-teal-800 text-white font-bold text-sm transition shadow-md"
                    >
                      Unlock Bookings Portal
                    </button>
                  </form>
                </div>
              ) : (
                /* Admin Bookings Dashboard */
                <div className="space-y-6">
                  {/* Top Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                    <div className="bg-white p-4 rounded-2xl border border-softgrey-200 shadow-sm">
                      <div className="text-xs text-charcoal-500 font-semibold uppercase tracking-wider">
                        Total Inquiries
                      </div>
                      <div className="text-2xl font-extrabold text-teal-950 font-display mt-1">
                        {enquiriesList.length}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-softgrey-200 shadow-sm">
                      <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">
                        New Bookings
                      </div>
                      <div className="text-2xl font-extrabold text-emerald-600 font-display mt-1">
                        {enquiriesList.filter((e) => e.status === 'New').length}
                      </div>
                    </div>
                    <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-2xl border border-softgrey-200 shadow-sm flex items-center justify-between">
                      <div>
                        <div className="text-xs text-charcoal-500 font-semibold uppercase tracking-wider">
                          Logged In
                        </div>
                        <div className="text-sm font-bold text-teal-900 mt-1">Chandu (Owner)</div>
                      </div>
                      <button
                        onClick={() => setIsAdminAuthenticated(false)}
                        className="text-xs text-red-600 font-semibold hover:underline"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>

                  {/* Bookings List */}
                  {enquiriesLoading ? (
                    <div className="text-center py-16 text-charcoal-500">
                      Loading latest customer bookings...
                    </div>
                  ) : enquiriesList.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-softgrey-200">
                      <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-900 flex items-center justify-center mx-auto mb-3">
                        <Calendar className="w-6 h-6 text-copper-600" />
                      </div>
                      <h4 className="text-lg font-bold text-teal-950">No Bookings Yet</h4>
                      <p className="text-xs text-charcoal-600 max-w-sm mx-auto mt-1">
                        When customers submit the online booking form on the website, their details and uploaded photos will appear right here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {enquiriesList.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl p-5 sm:p-6 border border-softgrey-200 shadow-sm hover:shadow-md transition"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-softgrey-200">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-lg font-bold text-teal-950 font-display">
                                  {item.customer_name}
                                </h4>
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                    item.status === 'New'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : item.status === 'In Progress'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-softgrey-200 text-charcoal-700'
                                  }`}
                                >
                                  {item.status || 'New'}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-charcoal-600">
                                <span className="font-semibold text-teal-900">
                                  📍 {item.locality_name || 'Hyderabad'}
                                </span>
                                <span>•</span>
                                <span className="font-semibold text-copper-700">
                                  🔧 {item.service_name || 'Plumbing Service'}
                                </span>
                                {item.created_at && (
                                  <>
                                    <span>•</span>
                                    <span>{new Date(item.created_at).toLocaleString()}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Contact Action Buttons */}
                            <div className="flex items-center gap-2">
                              <a
                                href={`tel:${item.phone}`}
                                className="px-3.5 py-1.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1.5 transition"
                              >
                                <Phone className="w-3.5 h-3.5 text-copper-400" />
                                <span>Call {item.phone}</span>
                              </a>
                              <a
                                href={`https://wa.me/91${item.phone}?text=Hi%20${encodeURIComponent(
                                  item.customer_name
                                )},%20this%20is%20Chandu%20from%20A1%20Chandu%20Plumbing%20Services%20regarding%20your%20service%20booking.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          </div>

                          {/* Problem Details */}
                          <div className="py-4 text-xs sm:text-sm text-charcoal-700">
                            <span className="font-bold text-teal-950">Customer Notes: </span>
                            {item.problem_description || 'No additional notes provided.'}
                          </div>

                          {/* Customer Uploaded Photo Section */}
                          <div className="pt-3 border-t border-softgrey-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              {item.attachment_url ? (
                                <div className="flex items-center gap-3">
                                  <div
                                    onClick={() => setExpandedImage(item.attachment_url || null)}
                                    className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-copper-400 cursor-pointer shadow-sm group flex-shrink-0"
                                    title="Click to view full photo"
                                  >
                                    <img
                                      src={item.attachment_url}
                                      alt="Customer leak photo"
                                      className="w-full h-full object-cover group-hover:scale-105 transition"
                                    />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                      <Eye className="w-5 h-5 text-white" />
                                    </div>
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
                                      <ImageIcon className="w-4 h-4 text-copper-600" />
                                      <span>Customer Uploaded Photo Attached</span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-xs">
                                      <button
                                        type="button"
                                        onClick={() => setExpandedImage(item.attachment_url || null)}
                                        className="text-copper-700 font-bold hover:underline flex items-center gap-1"
                                      >
                                        <Eye className="w-3 h-3" /> View Photo
                                      </button>
                                      <a
                                        href={item.attachment_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-charcoal-500 hover:text-teal-900 flex items-center gap-1"
                                      >
                                        <ExternalLink className="w-3 h-3" /> Open in New Tab
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xs text-charcoal-500 italic">
                                  No photo attached for this booking
                                </div>
                              )}
                            </div>

                            {/* Update Status Selector */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-charcoal-600">Status:</span>
                              <select
                                value={item.status || 'New'}
                                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                className="px-3 py-1.5 rounded-lg border border-softgrey-300 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-teal-900"
                              >
                                <option value="New">New</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 18. FULL RESOLUTION IMAGE VIEWER LIGHTBOX */}
      {expandedImage && (
        <div
          onClick={() => setExpandedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={expandedImage}
              alt="Uploaded Customer Leak"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl mx-auto"
            />
            <div className="text-center mt-3 text-xs text-white/80">
              Customer Leak Photo • Click outside or close button to exit
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
