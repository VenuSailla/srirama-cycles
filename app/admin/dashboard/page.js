'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Sliders,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Search,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  Eye,
  X,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Check,
  RefreshCw,
  FolderPlus,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Award,
  Globe,
  Truck,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  Lock,
  KeyRound,
  Filter,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Verified bicycle image presets for quick selection
const CYCLE_IMAGE_PRESETS = [
  {
    label: 'Specialized Full-Suspension MTB',
    category: 'Mountain Cycles',
    url: '/slider/hero-specialized-mtb.jpg',
  },
  {
    label: 'Forest Trail Mountain Bike',
    category: 'Mountain Cycles',
    url: '/slider/trail-mountain-bike.jpg',
  },
  {
    label: 'Aero Sports Road Racer (Gold/Yellow Rims)',
    category: 'Road Cycles',
    url: '/slider/road-speed-racer.jpg',
  },
  {
    label: 'City Commuter & Cruiser (White/Gold)',
    category: 'City & Hybrid Cycles',
    url: '/slider/city-cruiser-bike.jpg',
  },
  {
    label: 'Kids & Family Training Bicycle',
    category: 'Kids Cycles',
    url: '/slider/kids-family-bicycle.jpg',
  },
];

const STANDARD_CATEGORIES = [
  'Road Cycles',
  'Mountain Cycles',
  'Ladies Cycles',
  'Kids Cycles',
  'City & Hybrid Cycles',
  'Disc Brake Cycles',
  'Bicycle Spare Parts and Accessories',
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { admin, adminLogout, loading: authLoading } = useAuth();

  // Navigation tab: exact 8 sidebar items
  // 'overview' (Dashboard), 'home' (Home Page Management), 'shop' (Shop & Products),
  // 'about' (About Us), 'track' (Track Orders), 'contact' (Contact Us), 'settings' (Settings)
  const [activeTab, setActiveTab] = useState('overview');
  const [shopSubTab, setShopSubTab] = useState('products'); // 'products', 'stock', 'categories'
  const [settingsSubTab, setSettingsSubTab] = useState('general'); // 'general', 'password', 'customers'
  const [selectedSimOrderId, setSelectedSimOrderId] = useState('');

  // Sidebar Layout Responsiveness
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Core Data States
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [slides, setSlides] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [customerSearch, setCustomerSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); // all, low, out
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('All');

  // Modal States
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [slideModalOpen, setSlideModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Custom Branded Confirmation Dialog State (replaces raw window.confirm)
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Delete',
    danger: true,
    onConfirm: null,
  });

  // Change Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ text: '', isError: false });

  // Notifications
  const [toastMessage, setToastMessage] = useState(null);

  // Product Form State
  const initialProductForm = {
    name: '',
    brand: 'Srirama Pro',
    category: 'Road Cycles',
    price: 18999,
    originalPrice: 22999,
    stock: 12,
    size: '18 Inch Alloy Frame / 700C Wheels',
    description: '',
    images: '/slider/hero-specialized-mtb.jpg',
    isFeatured: false,
    isBestSeller: false,
    warranty: '1 Year Frame Warranty, 6 Months Parts',
    deliveryInfo: 'Doorstep delivery available; 95% pre-assembled.',
  };
  const [productForm, setProductForm] = useState(initialProductForm);

  // Category Form State
  const initialCategoryForm = {
    name: '',
    description: '',
    image: '/slider/hero-specialized-mtb.jpg',
    order: 1,
    isActive: true,
  };
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm);

  // Slide Form State
  const initialSlideForm = {
    order: 1,
    title: '',
    titleHighlight: '',
    subtitle: 'SRI RAMA SHOWROOM',
    description: '',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    secondaryButtonText: 'Explore Collection',
    secondaryButtonLink: '/shop',
    imageUrl: '/slider/hero-specialized-mtb.jpg',
    tag: 'Kazipet Spotlight',
    quote: '“Life is like riding a bicycle. To keep your balance, you must keep moving.”',
    quoteAuthor: 'Albert Einstein',
    badge: 'Road Series from ₹12,499',
    isActive: true,
  };
  const [slideForm, setSlideForm] = useState(initialSlideForm);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openConfirmModal = (title, message, confirmText, onConfirm) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      confirmText: confirmText || 'Delete',
      danger: true,
      onConfirm,
    });
  };

  const closeConfirmModal = () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false, onConfirm: null }));
  };

  // Check Auth
  useEffect(() => {
    if (!authLoading && !admin) {
      router.push('/admin/login');
    }
  }, [admin, authLoading, router]);

  // Load All CMS Data
  useEffect(() => {
    if (admin) {
      loadAllData();
    }
  }, [admin]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, catRes, ordRes, custRes, slideRes, enqRes, setRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/products?limit=200'),
        fetch('/api/admin/categories'),
        fetch('/api/admin/orders'),
        fetch('/api/admin/customers'),
        fetch('/api/admin/slides'),
        fetch('/api/admin/enquiries'),
        fetch('/api/site-settings'),
      ]);

      const [statsData, prodData, catData, ordData, custData, slideData, enqData, setData] = await Promise.all([
        statsRes.json(),
        prodRes.json(),
        catRes.json(),
        ordRes.json(),
        custRes.json(),
        slideRes.json(),
        enqRes.json(),
        setRes.json(),
      ]);

      if (statsData.success) setStats(statsData.stats);
      if (prodData.success) setProducts(prodData.products || []);
      if (catData.success) setCategories(catData.categories || []);
      if (ordData.success) {
        const orderList = ordData.orders || [];
        setOrders(orderList);
        if (orderList.length > 0 && !selectedSimOrderId) {
          setSelectedSimOrderId(orderList[0]._id);
        }
      }
      if (custData.success) setCustomers(custData.customers || []);
      if (slideData.success) setSlides(slideData.slides || []);
      if (enqData.success) setEnquiries(enqData.enquiries || []);
      if (setData.success) setSiteSettings(setData.settings || {});
    } catch (err) {
      console.warn('Dashboard data fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  // --- PRODUCT HANDLERS ---
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      ...initialProductForm,
      category: categories[0]?.name || 'Road Cycles',
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name || '',
      brand: prod.brand || 'Srirama Pro',
      category: prod.category || 'Road Cycles',
      price: prod.price || 0,
      originalPrice: prod.originalPrice || 0,
      stock: prod.stock || 0,
      size: prod.size || 'Standard',
      description: prod.description || '',
      images: Array.isArray(prod.images) ? prod.images.join(', ') : prod.images || '',
      isFeatured: !!prod.isFeatured,
      isBestSeller: !!prod.isBestSeller,
      warranty: prod.warranty || '1 Year Frame Warranty',
      deliveryInfo: prod.deliveryInfo || 'Doorstep delivery available',
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      ...productForm,
      images:
        typeof productForm.images === 'string'
          ? productForm.images
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : productForm.images,
      isAvailable: Number(productForm.stock) > 0,
    };

    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const d = await res.json();
        if (d.success) {
          setProducts((prev) => prev.map((p) => (p._id === editingProduct._id ? d.product : p)));
          showToast(`✓ Updated "${d.product.name}" in MongoDB.`);
        } else {
          alert(d.error || 'Failed to update product');
          return;
        }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const d = await res.json();
        if (d.success) {
          setProducts((prev) => [d.product, ...prev]);
          showToast(`✓ Added "${d.product.name}" to MongoDB catalog.`);
        } else {
          alert(d.error || 'Failed to create product');
          return;
        }
      }
      setProductModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      alert('Error saving product: ' + err.message);
    }
  };

  const handleDeleteProduct = (id, name) => {
    openConfirmModal(
      'Delete Product',
      `Are you sure you want to permanently delete "${name}" from MongoDB? This action cannot be undone.`,
      'Delete Product',
      async () => {
        try {
          const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
          const d = await res.json();
          if (d.success) {
            setProducts((prev) => prev.filter((p) => p._id !== id));
            showToast(`✓ Deleted "${name}".`);
          } else {
            alert(d.error || 'Failed to delete product');
          }
        } catch (err) {
          alert('Error deleting product');
        }
      }
    );
  };

  const handleQuickStockUpdate = async (productId, delta) => {
    const prod = products.find((p) => p._id === productId);
    if (!prod) return;
    const newStock = Math.max(0, (prod.stock || 0) + delta);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock, isAvailable: newStock > 0 }),
      });
      const d = await res.json();
      if (d.success) {
        setProducts((prev) => prev.map((p) => (p._id === productId ? d.product : p)));
        showToast(`✓ Stock for "${prod.name}" adjusted to ${newStock} units.`);
      }
    } catch (err) {
      alert('Could not update stock');
    }
  };

  // --- CATEGORY HANDLERS ---
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ ...initialCategoryForm, order: categories.length + 1 });
    setCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name || '',
      description: cat.description || '',
      image: cat.image || '',
      order: cat.order || 1,
      isActive: cat.isActive !== false,
    });
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const res = await fetch(`/api/admin/categories/${editingCategory._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryForm),
        });
        const d = await res.json();
        if (d.success) {
          setCategories((prev) => prev.map((c) => (c._id === editingCategory._id ? d.category : c)));
          showToast(`✓ Category "${d.category.name}" updated.`);
        }
      } else {
        const res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryForm),
        });
        const d = await res.json();
        if (d.success) {
          setCategories((prev) => [...prev, d.category]);
          showToast(`✓ Category "${d.category.name}" created.`);
        } else {
          alert(d.error || 'Failed to create category');
          return;
        }
      }
      setCategoryModalOpen(false);
      setEditingCategory(null);
    } catch (err) {
      alert('Error saving category');
    }
  };

  const handleDeleteCategory = (id, name) => {
    openConfirmModal(
      'Delete Category',
      `Delete category "${name}"? Products assigned to this category will not be deleted, but the category pill will be removed.`,
      'Delete Category',
      async () => {
        try {
          const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
          const d = await res.json();
          if (d.success) {
            setCategories((prev) => prev.filter((c) => c._id !== id));
            showToast(`✓ Deleted category "${name}".`);
          }
        } catch (err) {
          alert('Error deleting category');
        }
      }
    );
  };

  // --- ORDER HANDLERS ---
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      const d = await res.json();
      if (d.success) {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? d.order : o)));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(d.order);
        }
        showToast(`✓ Order status transitioned to "${newStatus}" in MongoDB.`);
      }
    } catch (err) {
      alert('Error updating order status');
    }
  };

  // --- SLIDER HANDLERS ---
  const handleOpenAddSlide = () => {
    setEditingSlide(null);
    setSlideForm({ ...initialSlideForm, order: slides.length + 1 });
    setSlideModalOpen(true);
  };

  const handleOpenEditSlide = (slide) => {
    setEditingSlide(slide);
    setSlideForm({
      order: slide.order || 1,
      title: slide.title || '',
      titleHighlight: slide.titleHighlight || '',
      subtitle: slide.subtitle || '',
      description: slide.description || '',
      buttonText: slide.buttonText || 'Shop Now',
      buttonLink: slide.buttonLink || '/shop',
      secondaryButtonText: slide.secondaryButtonText || 'Explore Collection',
      secondaryButtonLink: slide.secondaryButtonLink || '/shop',
      imageUrl: slide.imageUrl || '',
      tag: slide.tag || '',
      quote: slide.quote || '',
      quoteAuthor: slide.quoteAuthor || '',
      badge: slide.badge || '',
      isActive: slide.isActive !== false,
    });
    setSlideModalOpen(true);
  };

  const handleSaveSlide = async (e) => {
    e.preventDefault();
    try {
      if (editingSlide) {
        const res = await fetch(`/api/admin/slides/${editingSlide._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(slideForm),
        });
        const d = await res.json();
        if (d.success) {
          setSlides((prev) => prev.map((s) => (s._id === editingSlide._id ? d.slide : s)));
          showToast('✓ Hero slider updated successfully.');
        }
      } else {
        const res = await fetch('/api/admin/slides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(slideForm),
        });
        const d = await res.json();
        if (d.success) {
          setSlides((prev) => [...prev, d.slide]);
          showToast('✓ New hero slide published.');
        }
      }
      setSlideModalOpen(false);
      setEditingSlide(null);
    } catch (err) {
      alert('Error saving slide');
    }
  };

  const handleDeleteSlide = (id) => {
    openConfirmModal(
      'Delete Hero Banner',
      'Are you sure you want to delete this promotional banner from the customer homepage slider?',
      'Delete Banner',
      async () => {
        try {
          const res = await fetch(`/api/admin/slides/${id}`, { method: 'DELETE' });
          const d = await res.json();
          if (d.success) {
            setSlides((prev) => prev.filter((s) => s._id !== id));
            showToast('✓ Banner removed from homepage slider.');
          }
        } catch (err) {
          alert('Error deleting slide');
        }
      }
    );
  };

  // --- SITE SETTINGS HANDLERS ---
  const handleSaveSettings = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings),
      });
      const d = await res.json();
      if (d.success) {
        showToast('✓ Page Content & Site Settings saved to MongoDB!');
      } else {
        alert(d.error || 'Failed to save settings');
      }
    } catch (err) {
      alert('Error saving settings: ' + err.message);
    }
  };

  // --- CHANGE PASSWORD HANDLER ---
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ text: '', isError: false });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ text: 'New password and confirmation do not match.', isError: true });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordMsg({ text: 'New password must be at least 6 characters long.', isError: true });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordForm),
      });
      const d = await res.json();
      if (d.success) {
        setPasswordMsg({ text: d.message, isError: false });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        showToast('✓ Admin password changed successfully.');
      } else {
        setPasswordMsg({ text: d.error || 'Failed to update password.', isError: true });
      }
    } catch (err) {
      setPasswordMsg({ text: 'Error contacting server: ' + err.message, isError: true });
    } finally {
      setPasswordLoading(false);
    }
  };

  // --- ENQUIRIES HANDLER ---
  const handleUpdateEnquiryStatus = async (id, newStatus) => {
    try {
      const res = await fetch('/api/admin/enquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const d = await res.json();
      if (d.success) {
        setEnquiries((prev) => prev.map((enq) => (enq._id === id ? { ...enq, status: newStatus } : enq)));
        showToast(`✓ Inquiry status marked as "${newStatus}".`);
      }
    } catch (err) {
      alert('Error updating inquiry status');
    }
  };

  const handleDeleteEnquiry = (id, name) => {
    openConfirmModal(
      'Delete Customer Inquiry',
      `Permanently delete message from ${name}?`,
      'Delete Message',
      async () => {
        try {
          const res = await fetch(`/api/admin/enquiries?id=${id}`, { method: 'DELETE' });
          const d = await res.json();
          if (d.success) {
            setEnquiries((prev) => prev.filter((enq) => enq._id !== id));
            showToast('✓ Customer inquiry deleted.');
          }
        } catch (err) {
          alert('Error deleting inquiry');
        }
      }
    );
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !productSearch ||
      p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand?.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory =
      productCategoryFilter === 'All' || p.category?.toLowerCase() === productCategoryFilter.toLowerCase();
    const matchesStock =
      stockFilter === 'all'
        ? true
        : stockFilter === 'low'
        ? p.stock > 0 && p.stock <= 5
        : p.stock <= 0;
    return matchesSearch && matchesCategory && matchesStock;
  });

  const lowStockProducts = products.filter((p) => p.stock <= 5);

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'All' || o.orderStatus === orderStatusFilter;
    const matchesSearch =
      !orderSearch ||
      o.orderId?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer?.phone?.includes(orderSearch);
    return matchesStatus && matchesSearch;
  });

  // Filtered Customers
  const filteredCustomers = customers.filter((c) => {
    return (
      !customerSearch ||
      c.name?.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.email?.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone?.includes(customerSearch)
    );
  });

  // Filtered Enquiries
  const filteredEnquiries = enquiries.filter((enq) => {
    if (enquiryStatusFilter === 'All') return true;
    return (enq.status || 'New') === enquiryStatusFilter;
  });

  // Order currently simulated in Track Order CMS
  const currentSimOrder = orders.find((o) => o._id === selectedSimOrderId) || orders[0] || null;

  // Real KPI stats calculations
  const totalProductsCount = stats?.totalProducts ?? products.length;
  const totalOrdersCount = stats?.totalOrders ?? orders.length;
  const pendingOrdersCount =
    stats?.pendingOrdersCount ??
    orders.filter((o) => o.orderStatus === 'Order Placed' || o.orderStatus === 'Confirmed' || o.orderStatus === 'Processing and Assembly').length;
  const totalCustomersCount = stats?.totalCustomers ?? customers.length;
  const lowStockCount = stats?.lowStockCount ?? lowStockProducts.length;
  const totalRevenueAmount = stats?.totalRevenue ?? orders.reduce((sum, o) => sum + (o.total || 0), 0);

  // Exact 8 Sidebar Items as requested by User
  const SIDEBAR_ITEMS = [
    { id: 'overview', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'home', name: 'Home Page Management', icon: Sliders, badge: slides.length },
    { id: 'shop', name: 'Shop & Products', icon: Package, badge: products.length },
    { id: 'about', name: 'About Us', icon: Award },
    { id: 'track', name: 'Track Orders', icon: ShoppingBag, badge: orders.length },
    { id: 'contact', name: 'Contact Us', icon: Phone, badge: enquiries.length },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  if (authLoading || !admin) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFF7ED',
          color: '#EA580C',
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            border: '3px solid #FED7AA',
            borderTopColor: '#EA580C',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: '14px',
          }}
        />
        <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>Authenticating Sri Rama Cycles CMS Admin...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FDFBF7' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '12px 22px',
            borderRadius: '12px',
            boxShadow: '0 12px 28px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 99999,
            fontSize: '0.92rem',
            fontWeight: 750,
            border: '1.5px solid #FED7AA',
            animation: 'slideIn 0.3s ease',
          }}
        >
          <Sparkles size={18} color="#FB923C" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MOBILE SIDEBAR BACKDROP */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 45,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* FIXED / COLLAPSIBLE SIDEBAR (Exact 8 items with Clean White & Orange Styling) */}
      <aside
        style={{
          width: sidebarCollapsed ? '78px' : '270px',
          backgroundColor: '#FFFFFF',
          borderRight: '1.5px solid #FED7AA',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          flexShrink: 0,
          zIndex: 50,
          transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: sidebarCollapsed ? '20px 12px' : '20px 18px',
            borderBottom: '1px solid #FED7AA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarCollapsed ? 'center' : 'space-between',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              overflow: 'hidden',
            }}
          >
            <img
              src="/logo.png"
              alt="Sri Rama Cycles"
              style={{
                height: '42px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                flexShrink: 0,
              }}
            />
            {!sidebarCollapsed && (
              <div>
                <div style={{ fontWeight: 900, color: '#1C1917', fontSize: '0.95rem', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                  SRI RAMA CYCLES
                </div>
                <div
                  style={{
                    fontSize: '0.72rem',
                    color: '#EA580C',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  CMS Admin Panel
                </div>
              </div>
            )}
          </Link>

          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(true)}
              title="Collapse sidebar to icon mode"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94A3B8',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '6px',
              }}
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* Sidebar Nav Buttons: EXACT 8 Items */}
        <div style={{ padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
          {sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(false)}
              title="Expand sidebar"
              style={{
                background: '#FFF7ED',
                border: '1px solid #FED7AA',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                color: '#EA580C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px',
              }}
            >
              <ChevronRight size={18} />
            </button>
          )}

          {SIDEBAR_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isItemActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id === 'shop') setShopSubTab('products');
                  setMobileSidebarOpen(false);
                }}
                title={sidebarCollapsed ? `${index + 1}. ${item.name}` : ''}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                  padding: sidebarCollapsed ? '12px 0' : '10px 14px',
                  borderRadius: '12px',
                  fontSize: '0.88rem',
                  fontWeight: isItemActive ? 800 : 650,
                  backgroundColor: isItemActive ? '#EA580C' : 'transparent',
                  color: isItemActive ? '#FFFFFF' : '#475569',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.16s ease',
                  boxShadow: isItemActive ? '0 4px 12px rgba(234, 88, 12, 0.25)' : 'none',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isItemActive) e.currentTarget.style.backgroundColor = '#FFEDD5';
                }}
                onMouseLeave={(e) => {
                  if (!isItemActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={18} color={isItemActive ? '#FFFFFF' : '#EA580C'} />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </div>

                {!sidebarCollapsed && item.badge !== undefined && (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: '9999px',
                      backgroundColor: isItemActive ? 'rgba(255,255,255,0.25)' : '#FFEDD5',
                      color: isItemActive ? '#FFFFFF' : '#EA580C',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 8. Logout Item at Bottom of Sidebar */}
        <div style={{ padding: '14px 12px', borderTop: '1px solid #FED7AA' }}>
          <button
            onClick={adminLogout}
            title="Sign out of Admin CMS"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              gap: '10px',
              width: '100%',
              padding: sidebarCollapsed ? '10px 0' : '10px 14px',
              borderRadius: '10px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#DC2626',
              fontWeight: 800,
              fontSize: '0.86rem',
              cursor: 'pointer',
              transition: 'background-color 0.18s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEE2E2')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
          >
            <LogOut size={16} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Navbar */}
        <header
          style={{
            height: '74px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1.5px solid #FED7AA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              aria-label="Toggle menu"
              style={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#FFF7ED',
                border: '1px solid #FED7AA',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                color: '#EA580C',
              }}
              className="mobile-menu-btn"
            >
              <Menu size={18} />
            </button>

            <div>
              <h1 style={{ fontSize: '1.22rem', fontWeight: 900, color: '#1E293B', margin: 0 }}>
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'home' && 'Home Page Management'}
                {activeTab === 'shop' && 'Shop & Products Management'}
                {activeTab === 'about' && 'About Us Management (50-Yr Golden Jubilee)'}
                {activeTab === 'track' && 'Track Orders Management & Status Workflow'}
                {activeTab === 'contact' && 'Contact Us Management & Messages'}
                {activeTab === 'settings' && 'CMS Settings & Security'}
              </h1>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Sri Rama Cycles & Auto Spares • Professional Management Panel
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Storefront Nav Pages Quick View */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#FFF7ED',
                border: '1.5px solid #FED7AA',
                padding: '5px 10px',
                borderRadius: '10px',
              }}
            >
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#9A3412', textTransform: 'uppercase' }}>
                Storefront:
              </span>
              <Link
                href="/"
                target="_blank"
                style={{
                  fontSize: '0.76rem',
                  fontWeight: 750,
                  color: '#EA580C',
                  padding: '3px 7px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #FED7AA',
                }}
              >
                Home ↗
              </Link>
              <Link
                href="/shop"
                target="_blank"
                style={{
                  fontSize: '0.76rem',
                  fontWeight: 750,
                  color: '#EA580C',
                  padding: '3px 7px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #FED7AA',
                }}
              >
                Shop ↗
              </Link>
              <Link
                href="/about"
                target="_blank"
                style={{
                  fontSize: '0.76rem',
                  fontWeight: 750,
                  color: '#EA580C',
                  padding: '3px 7px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #FED7AA',
                }}
              >
                About ↗
              </Link>
              <Link
                href="/track-order"
                target="_blank"
                style={{
                  fontSize: '0.76rem',
                  fontWeight: 750,
                  color: '#EA580C',
                  padding: '3px 7px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #FED7AA',
                }}
              >
                Track ↗
              </Link>
            </div>

            <button
              onClick={loadAllData}
              title="Refresh real MongoDB data"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #FED7AA',
                backgroundColor: '#FFF7ED',
                color: '#EA580C',
                fontSize: '0.82rem',
                fontWeight: 750,
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={14} className={loading ? 'spin-icon' : ''} />
              <span>Sync</span>
            </button>

            {/* Admin Profile Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '50px',
                backgroundColor: '#FFF7ED',
                border: '1.5px solid #FED7AA',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: '#EA580C',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                RA
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E293B' }}>
                  {admin?.name || 'Admin'}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#16A34A', fontWeight: 800 }}>
                  ● Super Administrator
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body Container */}
        <main style={{ padding: '26px', flex: 1 }}>
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              {/* 6 Real MongoDB KPI Metrics Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                  gap: '18px',
                  marginBottom: '26px',
                }}
              >
                {/* 1. Total Products */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1.5px solid #FED7AA', boxShadow: '0 2px 8px rgba(249, 115, 22, 0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em' }}>TOTAL PRODUCTS</div>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={20} />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#1E293B', marginTop: '10px' }}>
                    {totalProductsCount}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#0284C7', fontWeight: 700, marginTop: '4px' }}>
                    Across {categories.length} bicycle categories
                  </div>
                </div>

                {/* 2. Total Orders */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1.5px solid #FED7AA', boxShadow: '0 2px 8px rgba(249, 115, 22, 0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em' }}>TOTAL ORDERS</div>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#FFEDD5', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShoppingBag size={20} />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#1E293B', marginTop: '10px' }}>
                    {totalOrdersCount}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#EA580C', fontWeight: 700, marginTop: '4px' }}>
                    Recorded customer bookings
                  </div>
                </div>

                {/* 3. Pending Orders */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1.5px solid #FED7AA', boxShadow: '0 2px 8px rgba(249, 115, 22, 0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em' }}>PENDING ORDERS</div>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Clock size={20} />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#1E293B', marginTop: '10px' }}>
                    {pendingOrdersCount}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#D97706', fontWeight: 700, marginTop: '4px' }}>
                    Require assembly or packing
                  </div>
                </div>

                {/* 4. Total Customers */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1.5px solid #FED7AA', boxShadow: '0 2px 8px rgba(249, 115, 22, 0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em' }}>TOTAL CUSTOMERS</div>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#F3E8FF', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users size={20} />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#1E293B', marginTop: '10px' }}>
                    {totalCustomersCount}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#9333EA', fontWeight: 700, marginTop: '4px' }}>
                    Registered customer accounts
                  </div>
                </div>

                {/* 5. Low-Stock Products */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1.5px solid #FED7AA', boxShadow: '0 2px 8px rgba(249, 115, 22, 0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em' }}>LOW STOCK ALERT</div>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AlertTriangle size={20} />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: lowStockCount > 0 ? '#DC2626' : '#1E293B', marginTop: '10px' }}>
                    {lowStockCount}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#DC2626', fontWeight: 700, marginTop: '4px' }}>
                    ≤ 5 units remaining in stock
                  </div>
                </div>

                {/* 6. Total Revenue */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1.5px solid #FED7AA', boxShadow: '0 2px 8px rgba(249, 115, 22, 0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em' }}>TOTAL REVENUE</div>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <TrendingUp size={20} />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#1E293B', marginTop: '10px' }}>
                    ₹{totalRevenueAmount.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: 700, marginTop: '4px' }}>
                    Real lifetime sales revenue
                  </div>
                </div>
              </div>

              {/* Low Stock Quick Restock Alert Table (if any) */}
              {lowStockProducts.length > 0 && (
                <div
                  style={{
                    backgroundColor: '#FEF2F2',
                    border: '1.5px solid #FECACA',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    marginBottom: '26px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <AlertTriangle size={22} color="#DC2626" />
                      <div>
                        <div style={{ fontWeight: 800, color: '#991B1B', fontSize: '1rem' }}>
                          Immediate Attention Required: {lowStockProducts.length} items low in stock!
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#B91C1C' }}>
                          Add inventory directly below to keep items active on customer shop page.
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('shop');
                        setShopSubTab('stock');
                        setStockFilter('low');
                      }}
                      style={{
                        backgroundColor: '#DC2626',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 750,
                        cursor: 'pointer',
                      }}
                    >
                      Open Full Stock Manager →
                    </button>
                  </div>

                  <div style={{ overflowX: 'auto', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #FECACA' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #FEE2E2', color: '#991B1B', fontSize: '0.76rem', textTransform: 'uppercase' }}>
                          <th style={{ padding: '10px 14px' }}>Product</th>
                          <th style={{ padding: '10px 14px' }}>Category</th>
                          <th style={{ padding: '10px 14px' }}>Stock Left</th>
                          <th style={{ padding: '10px 14px', textAlign: 'right' }}>Quick Restock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lowStockProducts.slice(0, 4).map((p) => (
                          <tr key={p._id} style={{ borderBottom: '1px solid #FEF2F2' }}>
                            <td style={{ padding: '10px 14px', fontWeight: 800, color: '#1E293B' }}>{p.name}</td>
                            <td style={{ padding: '10px 14px', color: '#64748B' }}>{p.category}</td>
                            <td style={{ padding: '10px 14px' }}>
                              <span style={{ fontWeight: 900, color: p.stock <= 0 ? '#DC2626' : '#B45309' }}>
                                {p.stock} units
                              </span>
                            </td>
                            <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '6px' }}>
                                <button
                                  onClick={() => handleQuickStockUpdate(p._id, +5)}
                                  style={{
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    backgroundColor: '#FFF7ED',
                                    border: '1px solid #FED7AA',
                                    color: '#EA580C',
                                    fontSize: '0.78rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                  }}
                                >
                                  +5
                                </button>
                                <button
                                  onClick={() => handleQuickStockUpdate(p._id, +10)}
                                  style={{
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    backgroundColor: '#DCFCE7',
                                    border: '1px solid #86EFAC',
                                    color: '#15803D',
                                    fontSize: '0.78rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                  }}
                                >
                                  +10
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Recent Orders Preview */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1.5px solid #FED7AA',
                  boxShadow: '0 2px 8px rgba(249, 115, 22, 0.05)',
                  marginBottom: '26px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.12rem', fontWeight: 900, color: '#1E293B', margin: 0 }}>
                      Recent Customer Orders
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                      Real orders stored in MongoDB from customer checkout
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('track')}
                    style={{
                      color: '#EA580C',
                      fontWeight: 800,
                      fontSize: '0.86rem',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    View All Orders & Live Tracker →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
                    <ShoppingBag size={36} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                    <div style={{ fontWeight: 700 }}>No customer orders placed yet.</div>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1.5px solid #F1F5F9', color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                          <th style={{ padding: '10px 14px' }}>Order ID</th>
                          <th style={{ padding: '10px 14px' }}>Customer</th>
                          <th style={{ padding: '10px 14px' }}>Items</th>
                          <th style={{ padding: '10px 14px' }}>Total Amount</th>
                          <th style={{ padding: '10px 14px' }}>Status</th>
                          <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((ord) => (
                          <tr key={ord._id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                            <td style={{ padding: '12px 14px', fontWeight: 800, color: '#EA580C' }}>
                              #{ord.orderId}
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                              <div style={{ fontWeight: 750, color: '#1E293B' }}>{ord.customer?.name}</div>
                              <div style={{ fontSize: '0.76rem', color: '#64748B' }}>{ord.customer?.phone}</div>
                            </td>
                            <td style={{ padding: '12px 14px', color: '#475569' }}>
                              {ord.items?.[0]?.name}
                              {ord.items?.length > 1 && ` + ${ord.items.length - 1} more`}
                            </td>
                            <td style={{ padding: '12px 14px', fontWeight: 800, color: '#1E293B' }}>
                              ₹{ord.total?.toLocaleString('en-IN')}
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                              <span
                                style={{
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  backgroundColor:
                                    ord.orderStatus === 'Delivered'
                                      ? '#DCFCE7'
                                      : ord.orderStatus === 'Shipped'
                                      ? '#E0F2FE'
                                      : ord.orderStatus === 'Cancelled'
                                      ? '#FEE2E2'
                                      : '#FFEDD5',
                                  color:
                                    ord.orderStatus === 'Delivered'
                                      ? '#15803D'
                                      : ord.orderStatus === 'Shipped'
                                      ? '#0369A1'
                                      : ord.orderStatus === 'Cancelled'
                                      ? '#B91C1C'
                                      : '#C2410C',
                                }}
                              >
                                {ord.orderStatus}
                              </span>
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                              <button
                                onClick={() => setSelectedOrder(ord)}
                                style={{
                                  padding: '5px 12px',
                                  backgroundColor: '#FFF7ED',
                                  border: '1px solid #FED7AA',
                                  borderRadius: '6px',
                                  color: '#EA580C',
                                  fontSize: '0.78rem',
                                  fontWeight: 750,
                                  cursor: 'pointer',
                                }}
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: HOME PAGE MANAGEMENT */}
          {activeTab === 'home' && (
            <div>
              {/* Top Banner with Storefront Link */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  border: '1.5px solid #FED7AA',
                  marginBottom: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.18rem', fontWeight: 900, color: '#1E293B', margin: 0 }}>
                    Home Page Management
                  </h3>
                  <div style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '2px' }}>
                    Add, edit and delete hero banners, slider images, store slogan, and top announcement bar.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link
                    href="/"
                    target="_blank"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '9px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#FFF7ED',
                      border: '1.5px solid #FED7AA',
                      color: '#EA580C',
                      textDecoration: 'none',
                      fontWeight: 750,
                      fontSize: '0.86rem',
                    }}
                  >
                    <ExternalLink size={15} />
                    <span>View Customer Home</span>
                  </Link>
                  <button
                    onClick={handleOpenAddSlide}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '9px 18px',
                      borderRadius: '8px',
                      backgroundColor: '#EA580C',
                      color: '#FFFFFF',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={16} />
                    <span>Add Hero Slide</span>
                  </button>
                </div>
              </div>

              {/* SLOGAN & ANNOUNCEMENT BAR EDITORS */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1.5px solid #FED7AA',
                  marginBottom: '24px',
                  boxShadow: '0 2px 8px rgba(249, 115, 22, 0.05)',
                }}
              >
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B', margin: '0 0 16px' }}>
                  Store Slogan & Customer Announcement Bar
                </h4>

                <form onSubmit={handleSaveSettings}>
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                      Official Store Slogan (Displayed on Home Page & Hero Ribbon)
                    </label>
                    <input
                      type="text"
                      value={siteSettings?.slogan || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, slogan: e.target.value })}
                      placeholder="e.g. Sri Rama Cycles – Your Trusted Partner on Every Road!"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #FED7AA',
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        backgroundColor: '#FFFDF9',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                      Top Announcement Bar Headline (Displayed on Navbar across entire site)
                    </label>
                    <input
                      type="text"
                      value={siteSettings?.announcementBar || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, announcementBar: e.target.value })}
                      placeholder="e.g. Golden Jubilee 50-Year Celebration Sale! Free doorstep assembly on all bicycles."
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #FED7AA',
                        fontSize: '0.92rem',
                        backgroundColor: '#FFFDF9',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      padding: '10px 22px',
                      backgroundColor: '#EA580C',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                    }}
                  >
                    Save Slogan & Announcement to Live Site
                  </button>
                </form>
              </div>

              {/* HERO SLIDES GRID */}
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                  Active Promotional Hero Slides ({slides.length})
                </h4>
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                  Slides cycle every 4.8 seconds on customer homepage
                </span>
              </div>

              {slides.length === 0 ? (
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1.5px solid #FED7AA', padding: '40px 20px', textAlign: 'center', color: '#94A3B8' }}>
                  <Sliders size={36} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                  <div style={{ fontWeight: 700, color: '#64748B' }}>No custom slides created. Customer homepage will use verified defaults.</div>
                  <button
                    onClick={handleOpenAddSlide}
                    style={{ marginTop: '12px', padding: '8px 16px', backgroundColor: '#EA580C', color: '#FFF', borderRadius: '8px', border: 'none', fontWeight: 750, cursor: 'pointer' }}
                  >
                    + Add First Slide
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '20px',
                  }}
                >
                  {slides.map((s, idx) => (
                    <div
                      key={s._id || idx}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1.5px solid #FED7AA',
                        padding: '20px',
                        boxShadow: '0 2px 8px rgba(249, 115, 22, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        {/* Image Preview */}
                        <div
                          style={{
                            height: '160px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            marginBottom: '14px',
                            position: 'relative',
                            backgroundColor: '#0F172A',
                          }}
                        >
                          <img
                            src={s.imageUrl}
                            alt={s.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              top: '10px',
                              left: '10px',
                              backgroundColor: 'rgba(0,0,0,0.7)',
                              color: '#FED7AA',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                            }}
                          >
                            Slide #{s.order || idx + 1}
                          </div>
                          {s.isActive === false && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                backgroundColor: '#DC2626',
                                color: '#FFF',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                              }}
                            >
                              Disabled
                            </div>
                          )}
                        </div>

                        <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#EA580C', textTransform: 'uppercase' }}>
                          {s.subtitle || 'HERO SLIDE'}
                        </div>
                        <h4 style={{ fontSize: '1.12rem', fontWeight: 900, color: '#1E293B', margin: '4px 0 8px' }}>
                          {s.title} {s.titleHighlight && <span style={{ color: '#EA580C' }}>{s.titleHighlight}</span>}
                        </h4>
                        <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.5, margin: '0 0 12px' }}>
                          {s.description}
                        </p>

                        {s.quote && (
                          <div style={{ backgroundColor: '#FFF7ED', padding: '10px', borderRadius: '8px', fontSize: '0.78rem', fontStyle: 'italic', color: '#7C2D12', marginBottom: '12px' }}>
                            {s.quote} — <strong>{s.quoteAuthor}</strong>
                          </div>
                        )}
                      </div>

                      <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 650 }}>
                          Action: {s.buttonText} → {s.buttonLink}
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenEditSlide(s)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#FFF7ED',
                              border: '1px solid #FED7AA',
                              borderRadius: '6px',
                              color: '#EA580C',
                              fontWeight: 750,
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSlide(s._id)}
                            style={{
                              padding: '6px 10px',
                              backgroundColor: '#FEF2F2',
                              border: '1px solid #FECACA',
                              borderRadius: '6px',
                              color: '#DC2626',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SHOP & PRODUCTS */}
          {activeTab === 'shop' && (
            <div>
              {/* Top Banner with Storefront Link */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  border: '1.5px solid #FED7AA',
                  marginBottom: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.18rem', fontWeight: 900, color: '#1E293B', margin: 0 }}>
                    Shop & Products Management
                  </h3>
                  <div style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '2px' }}>
                    Add cycles, auto spares, adjust stock quantities, and configure bicycle categories.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link
                    href="/shop"
                    target="_blank"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '9px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#FFF7ED',
                      border: '1.5px solid #FED7AA',
                      color: '#EA580C',
                      textDecoration: 'none',
                      fontWeight: 750,
                      fontSize: '0.86rem',
                    }}
                  >
                    <ExternalLink size={15} />
                    <span>View Customer Shop</span>
                  </Link>
                  <button
                    onClick={handleOpenAddProduct}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '9px 18px',
                      borderRadius: '8px',
                      backgroundColor: '#EA580C',
                      color: '#FFFFFF',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={16} />
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>

              {/* Sub-Navigation Pills for Shop CMS */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setShopSubTab('products')}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontSize: '0.88rem',
                    fontWeight: shopSubTab === 'products' ? 800 : 650,
                    backgroundColor: shopSubTab === 'products' ? '#EA580C' : '#FFFFFF',
                    color: shopSubTab === 'products' ? '#FFFFFF' : '#475569',
                    border: '1.5px solid #FED7AA',
                    cursor: 'pointer',
                  }}
                >
                  Products Catalog ({products.length})
                </button>
                <button
                  onClick={() => setShopSubTab('stock')}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontSize: '0.88rem',
                    fontWeight: shopSubTab === 'stock' ? 800 : 650,
                    backgroundColor: shopSubTab === 'stock' ? '#EA580C' : '#FFFFFF',
                    color: shopSubTab === 'stock' ? '#FFFFFF' : '#475569',
                    border: '1.5px solid #FED7AA',
                    cursor: 'pointer',
                  }}
                >
                  Real-time Stock Manager ({lowStockProducts.length} low)
                </button>
                <button
                  onClick={() => setShopSubTab('categories')}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontSize: '0.88rem',
                    fontWeight: shopSubTab === 'categories' ? 800 : 650,
                    backgroundColor: shopSubTab === 'categories' ? '#EA580C' : '#FFFFFF',
                    color: shopSubTab === 'categories' ? '#FFFFFF' : '#475569',
                    border: '1.5px solid #FED7AA',
                    cursor: 'pointer',
                  }}
                >
                  Categories Manager ({categories.length})
                </button>
              </div>

              {/* SUBTAB 1: PRODUCTS CATALOG */}
              {shopSubTab === 'products' && (
                <div>
                  {/* Search & Category Filter */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      border: '1.5px solid #FED7AA',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 300px' }}>
                      <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
                        <input
                          type="text"
                          placeholder="Search product name or brand..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 14px 10px 38px',
                            borderRadius: '10px',
                            border: '1.5px solid #FED7AA',
                            fontSize: '0.88rem',
                            outline: 'none',
                            backgroundColor: '#FFFDF9',
                          }}
                        />
                        <Search
                          size={16}
                          color="#94A3B8"
                          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                        />
                      </div>

                      <select
                        value={productCategoryFilter}
                        onChange={(e) => setProductCategoryFilter(e.target.value)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #FED7AA',
                          backgroundColor: '#FFFDF9',
                          fontSize: '0.88rem',
                          fontWeight: 650,
                          color: '#334155',
                          outline: 'none',
                        }}
                      >
                        <option value="All">All Categories ({products.length})</option>
                        {categories.map((c) => (
                          <option key={c._id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#64748B' }}>
                      Showing {filteredProducts.length} of {products.length} products
                    </div>
                  </div>

                  {/* Product Table */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1.5px solid #FED7AA',
                      boxShadow: '0 2px 8px rgba(249, 115, 22, 0.05)',
                    }}
                  >
                    {filteredProducts.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '48px 20px', color: '#94A3B8' }}>
                        <Package size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#64748B' }}>
                          No matching products found in MongoDB
                        </div>
                      </div>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                          <thead>
                            <tr style={{ borderBottom: '1.5px solid #F1F5F9', color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                              <th style={{ padding: '12px 14px' }}>Product</th>
                              <th style={{ padding: '12px 14px' }}>Category</th>
                              <th style={{ padding: '12px 14px' }}>Price</th>
                              <th style={{ padding: '12px 14px' }}>Stock</th>
                              <th style={{ padding: '12px 14px' }}>Badges</th>
                              <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredProducts.map((p) => {
                              const isLow = p.stock > 0 && p.stock <= 5;
                              const isOut = p.stock <= 0;
                              return (
                                <tr key={p._id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                                  <td style={{ padding: '14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                      <img
                                        src={p.images?.[0] || '/logo.png'}
                                        alt={p.name}
                                        style={{
                                          width: '52px',
                                          height: '52px',
                                          borderRadius: '10px',
                                          objectFit: 'cover',
                                          backgroundColor: '#F8FAFC',
                                          border: '1px solid #E2E8F0',
                                        }}
                                      />
                                      <div>
                                        <div style={{ fontWeight: 800, color: '#1E293B' }}>{p.name}</div>
                                        <div style={{ fontSize: '0.78rem', color: '#EA580C', fontWeight: 700 }}>
                                          {p.brand}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td style={{ padding: '14px', color: '#475569', fontWeight: 600 }}>
                                    {p.category}
                                  </td>
                                  <td style={{ padding: '14px' }}>
                                    <div style={{ fontWeight: 800, color: '#1E293B' }}>
                                      ₹{p.price?.toLocaleString('en-IN')}
                                    </div>
                                    {p.originalPrice > p.price && (
                                      <div style={{ fontSize: '0.75rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                                        ₹{p.originalPrice?.toLocaleString('en-IN')}
                                      </div>
                                    )}
                                  </td>
                                  <td style={{ padding: '14px' }}>
                                    <span
                                      style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        padding: '3px 8px',
                                        borderRadius: '6px',
                                        backgroundColor: isOut ? '#FEE2E2' : isLow ? '#FEF3C7' : '#DCFCE7',
                                        color: isOut ? '#DC2626' : isLow ? '#B45309' : '#15803D',
                                      }}
                                    >
                                      {isOut ? 'Out of Stock' : isLow ? `${p.stock} units left` : `${p.stock} in stock`}
                                    </span>
                                  </td>
                                  <td style={{ padding: '14px' }}>
                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                      {p.isFeatured && (
                                        <span style={{ fontSize: '0.7rem', fontWeight: 800, backgroundColor: '#FFEDD5', color: '#EA580C', padding: '2px 6px', borderRadius: '4px' }}>
                                          Featured
                                        </span>
                                      )}
                                      {p.isBestSeller && (
                                        <span style={{ fontSize: '0.7rem', fontWeight: 800, backgroundColor: '#E0E7FF', color: '#4338CA', padding: '2px 6px', borderRadius: '4px' }}>
                                          Best Seller
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td style={{ padding: '14px', textAlign: 'right' }}>
                                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                                      <button
                                        onClick={() => handleOpenEditProduct(p)}
                                        title="Edit Product"
                                        style={{
                                          padding: '7px 10px',
                                          backgroundColor: '#FFF7ED',
                                          border: '1px solid #FED7AA',
                                          borderRadius: '8px',
                                          color: '#EA580C',
                                          cursor: 'pointer',
                                        }}
                                      >
                                        <Edit size={15} />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteProduct(p._id, p.name)}
                                        title="Delete from MongoDB"
                                        style={{
                                          padding: '7px 10px',
                                          backgroundColor: '#FEF2F2',
                                          border: '1px solid #FECACA',
                                          borderRadius: '8px',
                                          color: '#DC2626',
                                          cursor: 'pointer',
                                        }}
                                      >
                                        <Trash2 size={15} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SUBTAB 2: REAL-TIME STOCK MANAGER */}
              {shopSubTab === 'stock' && (
                <div>
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '18px 24px',
                      border: '1.5px solid #FED7AA',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                        Real-time Inventory & Stock Threshold Manager
                      </h4>
                      <div style={{ fontSize: '0.84rem', color: '#64748B' }}>
                        Quickly adjust warehouse inventory without opening full edit modals
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setStockFilter('all')}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: 750,
                          backgroundColor: stockFilter === 'all' ? '#EA580C' : '#FFF7ED',
                          color: stockFilter === 'all' ? '#FFF' : '#EA580C',
                          border: '1px solid #FED7AA',
                          cursor: 'pointer',
                        }}
                      >
                        All Items ({products.length})
                      </button>
                      <button
                        onClick={() => setStockFilter('low')}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: 750,
                          backgroundColor: stockFilter === 'low' ? '#D97706' : '#FEF3C7',
                          color: stockFilter === 'low' ? '#FFF' : '#B45309',
                          border: '1px solid #FDE68A',
                          cursor: 'pointer',
                        }}
                      >
                        Low Stock ({lowStockProducts.length})
                      </button>
                      <button
                        onClick={() => setStockFilter('out')}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: 750,
                          backgroundColor: stockFilter === 'out' ? '#DC2626' : '#FEE2E2',
                          color: stockFilter === 'out' ? '#FFF' : '#DC2626',
                          border: '1px solid #FECACA',
                          cursor: 'pointer',
                        }}
                      >
                        Out of Stock ({products.filter((p) => p.stock <= 0).length})
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1.5px solid #FED7AA',
                      boxShadow: '0 2px 8px rgba(249, 115, 22, 0.05)',
                    }}
                  >
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '1.5px solid #F1F5F9', color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                            <th style={{ padding: '12px 14px' }}>Product</th>
                            <th style={{ padding: '12px 14px' }}>Category</th>
                            <th style={{ padding: '12px 14px' }}>Current Stock</th>
                            <th style={{ padding: '12px 14px' }}>Status</th>
                            <th style={{ padding: '12px 14px', textAlign: 'right' }}>Quick Adjust</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((p) => {
                            const isLow = p.stock > 0 && p.stock <= 5;
                            const isOut = p.stock <= 0;
                            return (
                              <tr key={p._id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                                <td style={{ padding: '14px', fontWeight: 800, color: '#1E293B' }}>
                                  {p.name}
                                </td>
                                <td style={{ padding: '14px', color: '#64748B' }}>{p.category}</td>
                                <td style={{ padding: '14px' }}>
                                  <span style={{ fontSize: '1.1rem', fontWeight: 900, color: isOut ? '#DC2626' : isLow ? '#B45309' : '#15803D' }}>
                                    {p.stock}
                                  </span>{' '}
                                  <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>units</span>
                                </td>
                                <td style={{ padding: '14px' }}>
                                  <span
                                    style={{
                                      fontSize: '0.76rem',
                                      fontWeight: 800,
                                      padding: '4px 10px',
                                      borderRadius: '20px',
                                      backgroundColor: isOut ? '#FEE2E2' : isLow ? '#FEF3C7' : '#DCFCE7',
                                      color: isOut ? '#DC2626' : isLow ? '#B45309' : '#15803D',
                                    }}
                                  >
                                    {isOut ? 'Unavailable' : isLow ? 'Critical Low' : 'Adequate'}
                                  </span>
                                </td>
                                <td style={{ padding: '14px', textAlign: 'right' }}>
                                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                                    <button
                                      onClick={() => handleQuickStockUpdate(p._id, -1)}
                                      disabled={p.stock <= 0}
                                      title="Decrease 1"
                                      style={{
                                        padding: '5px 10px',
                                        backgroundColor: '#F1F5F9',
                                        border: '1px solid #CBD5E1',
                                        borderRadius: '6px',
                                        fontWeight: 800,
                                        cursor: p.stock <= 0 ? 'not-allowed' : 'pointer',
                                      }}
                                    >
                                      -1
                                    </button>
                                    <button
                                      onClick={() => handleQuickStockUpdate(p._id, +5)}
                                      title="Add 5 items"
                                      style={{
                                        padding: '5px 12px',
                                        backgroundColor: '#FFF7ED',
                                        border: '1px solid #FED7AA',
                                        borderRadius: '6px',
                                        color: '#EA580C',
                                        fontWeight: 800,
                                        cursor: 'pointer',
                                      }}
                                    >
                                      +5
                                    </button>
                                    <button
                                      onClick={() => handleQuickStockUpdate(p._id, +10)}
                                      title="Add 10 items"
                                      style={{
                                        padding: '5px 12px',
                                        backgroundColor: '#DCFCE7',
                                        border: '1px solid #86EFAC',
                                        borderRadius: '6px',
                                        color: '#15803D',
                                        fontWeight: 800,
                                        cursor: 'pointer',
                                      }}
                                    >
                                      +10
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: CATEGORIES MANAGER */}
              {shopSubTab === 'categories' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                        Storefront Bicycle & Spares Categories
                      </h4>
                      <div style={{ fontSize: '0.84rem', color: '#64748B' }}>
                        Configure categories shown in customer navigation and shop filter bars
                      </div>
                    </div>
                    <button
                      onClick={handleOpenAddCategory}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: '#EA580C',
                        color: '#FFFFFF',
                        padding: '9px 16px',
                        borderRadius: '8px',
                        fontWeight: 750,
                        fontSize: '0.86rem',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <Plus size={16} />
                      <span>Create Category</span>
                    </button>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '20px',
                    }}
                  >
                    {categories.map((cat) => (
                      <div
                        key={cat._id}
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '16px',
                          border: '1.5px solid #FED7AA',
                          padding: '20px',
                          boxShadow: '0 2px 8px rgba(249, 115, 22, 0.05)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div style={{ height: '140px', borderRadius: '12px', overflow: 'hidden', marginBottom: '14px', backgroundColor: '#F8FAFC' }}>
                            <img
                              src={cat.image || '/slider/hero-specialized-mtb.jpg'}
                              alt={cat.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                            <h4 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                              {cat.name}
                            </h4>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                padding: '3px 8px',
                                borderRadius: '12px',
                                backgroundColor: '#FFEDD5',
                                color: '#EA580C',
                              }}
                            >
                              {cat.productCount || 0} products
                            </span>
                          </div>

                          <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.5, minHeight: '2.8em' }}>
                            {cat.description || 'No description provided.'}
                          </p>
                        </div>

                        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '14px', marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                            Order: {cat.order || 0}
                          </span>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleOpenEditCategory(cat)}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#FFF7ED',
                                border: '1px solid #FED7AA',
                                borderRadius: '6px',
                                color: '#EA580C',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat._id, cat.name)}
                              style={{
                                padding: '6px 10px',
                                backgroundColor: '#FEF2F2',
                                border: '1px solid #FECACA',
                                borderRadius: '6px',
                                color: '#DC2626',
                                cursor: 'pointer',
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ABOUT US MANAGEMENT */}
          {activeTab === 'about' && (
            <div>
              {/* Top Banner with Storefront Link */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  border: '1.5px solid #FED7AA',
                  marginBottom: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.18rem', fontWeight: 900, color: '#1E293B', margin: 0 }}>
                    About Us Page Management (1976 – 2026 Golden Jubilee)
                  </h3>
                  <div style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '2px' }}>
                    Edit company history, founder story (Ravula Rakesh Kumar), workshop info, and archival bill captions.
                  </div>
                </div>

                <Link
                  href="/about"
                  target="_blank"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#FFF7ED',
                    border: '1.5px solid #FED7AA',
                    color: '#EA580C',
                    textDecoration: 'none',
                    fontWeight: 750,
                    fontSize: '0.86rem',
                  }}
                >
                  <ExternalLink size={15} />
                  <span>View Customer About Us</span>
                </Link>
              </div>

              {/* FOUNDER STORY & ARCHIVAL PROOFS */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1.5px solid #FED7AA',
                  marginBottom: '24px',
                  boxShadow: '0 2px 8px rgba(249, 115, 22, 0.05)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Award size={20} color="#EA580C" />
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                    Company Description & Heritage Narrative
                  </h4>
                </div>

                <form onSubmit={handleSaveSettings}>
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                      Founder & Showroom 50-Year Heritage Narrative
                    </label>
                    <textarea
                      rows={5}
                      value={siteSettings?.aboutFounderStory || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, aboutFounderStory: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #FED7AA',
                        fontSize: '0.92rem',
                        lineHeight: 1.6,
                        backgroundColor: '#FFFDF9',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '22px' }}>
                    <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                      Short Heritage Summary (Used across website headers & footers)
                    </label>
                    <textarea
                      rows={2}
                      value={siteSettings?.aboutUsShort || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, aboutUsShort: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #FED7AA',
                        fontSize: '0.92rem',
                        backgroundColor: '#FFFDF9',
                      }}
                    />
                  </div>

                  {/* ARCHIVAL PROOFS SECTION */}
                  <div style={{ borderTop: '1.5px solid #FED7AA', paddingTop: '20px', marginBottom: '22px' }}>
                    <h5 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#7C2D12', margin: '0 0 14px' }}>
                      Archival Proofs (Side-by-Side 1980 Vintage Bill vs. 2026 Modern Tax Invoice)
                    </h5>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                      {/* 1980 Vintage Bill Card */}
                      <div style={{ backgroundColor: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: '14px', padding: '16px' }}>
                        <div style={{ height: '170px', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px', backgroundColor: '#F8FAFC' }}>
                          <img
                            src="/receipt-1980.jpg"
                            alt="1980 Vintage Bill"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#9A3412', marginBottom: '6px' }}>
                          1980 Vintage Cash Bill Caption
                        </div>
                        <textarea
                          rows={3}
                          value={siteSettings?.aboutReceipt1980Text || ''}
                          onChange={(e) => setSiteSettings({ ...siteSettings, aboutReceipt1980Text: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            border: '1px solid #FED7AA',
                            fontSize: '0.84rem',
                            backgroundColor: '#FFFFFF',
                          }}
                        />
                      </div>

                      {/* 2026 Modern Invoice Card */}
                      <div style={{ backgroundColor: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: '14px', padding: '16px' }}>
                        <div style={{ height: '170px', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px', backgroundColor: '#F8FAFC' }}>
                          <img
                            src="/receipt-2026.jpg"
                            alt="2026 Modern Tax Invoice"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#9A3412', marginBottom: '6px' }}>
                          2026 Modern Tax Invoice Caption
                        </div>
                        <textarea
                          rows={3}
                          value={siteSettings?.aboutReceipt2026Text || ''}
                          onChange={(e) => setSiteSettings({ ...siteSettings, aboutReceipt2026Text: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            border: '1px solid #FED7AA',
                            fontSize: '0.84rem',
                            backgroundColor: '#FFFFFF',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      padding: '11px 26px',
                      backgroundColor: '#EA580C',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                    }}
                  >
                    Save About Us Changes to MongoDB
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 5: TRACK ORDERS */}
          {activeTab === 'track' && (
            <div>
              {/* Top Banner with Storefront Link */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  border: '1.5px solid #FED7AA',
                  marginBottom: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.18rem', fontWeight: 900, color: '#1E293B', margin: 0 }}>
                    Track Orders Management & Status Workflow
                  </h3>
                  <div style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '2px' }}>
                    View orders, inspect delivery items, and transition status stages reflecting immediately on customer live tracking.
                  </div>
                </div>

                <Link
                  href="/track-order"
                  target="_blank"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#FFF7ED',
                    border: '1.5px solid #FED7AA',
                    color: '#EA580C',
                    textDecoration: 'none',
                    fontWeight: 750,
                    fontSize: '0.86rem',
                  }}
                >
                  <ExternalLink size={15} />
                  <span>View Customer Track Page</span>
                </Link>
              </div>

              {/* LIVE SIMULATOR: ADVANCE ORDER STATUS */}
              {orders.length > 0 && currentSimOrder && (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1.5px solid #FED7AA',
                    marginBottom: '24px',
                    boxShadow: '0 2px 8px rgba(249, 115, 22, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                    <div>
                      <h4 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                        Order Status Workflow Stepper
                      </h4>
                      <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                        Click any status stage below to update order in MongoDB and reflect on customer live tracking
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 750, color: '#334155' }}>Select Order:</span>
                      <select
                        value={currentSimOrder._id}
                        onChange={(e) => setSelectedSimOrderId(e.target.value)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1.5px solid #FED7AA',
                          backgroundColor: '#FFFDF9',
                          fontWeight: 750,
                          fontSize: '0.86rem',
                          color: '#EA580C',
                        }}
                      >
                        {orders.map((o) => (
                          <option key={o._id} value={o._id}>
                            #{o.orderId} - {o.customer?.name} ({o.orderStatus})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Selected Order Summary Card */}
                  <div
                    style={{
                      backgroundColor: '#FFF7ED',
                      borderRadius: '12px',
                      border: '1.5px solid #FED7AA',
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                      marginBottom: '22px',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.76rem', color: '#9A3412', fontWeight: 800 }}>SELECTED ORDER</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1E293B' }}>#{currentSimOrder.orderId}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.76rem', color: '#9A3412', fontWeight: 800 }}>CUSTOMER</div>
                      <div style={{ fontWeight: 800, color: '#1E293B' }}>{currentSimOrder.customer?.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{currentSimOrder.customer?.phone}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.76rem', color: '#9A3412', fontWeight: 800 }}>DESTINATION</div>
                      <div style={{ fontWeight: 800, color: '#1E293B' }}>{currentSimOrder.shippingAddress?.city || 'Kazipet'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.76rem', color: '#9A3412', fontWeight: 800 }}>ORDER TOTAL</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#15803D' }}>₹{currentSimOrder.total?.toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.76rem', color: '#9A3412', fontWeight: 800 }}>CURRENT STAGE</div>
                      <span
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          padding: '4px 10px',
                          borderRadius: '20px',
                          backgroundColor: '#EA580C',
                          color: '#FFFFFF',
                          display: 'inline-block',
                          marginTop: '2px',
                        }}
                      >
                        ● {currentSimOrder.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Status Stage Buttons */}
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Advance Stage with 1-Click:
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {[
                        'Order Placed',
                        'Confirmed',
                        'Processing and Assembly',
                        'Packed',
                        'Shipped',
                        'Out for Delivery',
                        'Delivered',
                        'Cancelled',
                      ].map((stageName, idx) => {
                        const isCurrent = currentSimOrder.orderStatus === stageName;
                        const isCancel = stageName === 'Cancelled';
                        return (
                          <button
                            key={stageName}
                            onClick={() => handleUpdateOrderStatus(currentSimOrder._id, stageName)}
                            style={{
                              padding: '9px 13px',
                              borderRadius: '8px',
                              border: isCurrent
                                ? isCancel
                                  ? '2px solid #DC2626'
                                  : '2px solid #EA580C'
                                : '1px solid #FED7AA',
                              backgroundColor: isCurrent
                                ? isCancel
                                  ? '#DC2626'
                                  : '#EA580C'
                                : '#FFFFFF',
                              color: isCurrent ? '#FFFFFF' : isCancel ? '#DC2626' : '#334155',
                              fontWeight: isCurrent ? 800 : 650,
                              fontSize: '0.82rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <span>{stageName}</span>
                            {isCurrent && <Check size={14} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ALL CUSTOMER ORDERS TABLE */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1.5px solid #FED7AA',
                  boxShadow: '0 2px 8px rgba(249, 115, 22, 0.05)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
                  <h4 style={{ fontSize: '1.08rem', fontWeight: 900, color: '#1E293B', margin: 0 }}>
                    All Customer Orders ({filteredOrders.length})
                  </h4>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="text"
                      placeholder="Search Order ID, Name, Phone..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid #FED7AA',
                        fontSize: '0.84rem',
                        outline: 'none',
                        backgroundColor: '#FFFDF9',
                      }}
                    />

                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid #FED7AA',
                        backgroundColor: '#FFFDF9',
                        fontSize: '0.84rem',
                        fontWeight: 650,
                        color: '#334155',
                      }}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Order Placed">Order Placed</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing and Assembly">Processing and Assembly</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
                    No customer orders found matching filter criteria.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1.5px solid #F1F5F9', color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                          <th style={{ padding: '12px 14px' }}>Order ID</th>
                          <th style={{ padding: '12px 14px' }}>Customer & Destination</th>
                          <th style={{ padding: '12px 14px' }}>Items</th>
                          <th style={{ padding: '12px 14px' }}>Total Amount</th>
                          <th style={{ padding: '12px 14px' }}>Status Transition</th>
                          <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((ord) => (
                          <tr key={ord._id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                            <td style={{ padding: '14px' }}>
                              <div style={{ fontWeight: 900, color: '#EA580C' }}>#{ord.orderId}</div>
                              <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                                {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                              </div>
                            </td>
                            <td style={{ padding: '14px' }}>
                              <div style={{ fontWeight: 750, color: '#1E293B' }}>{ord.customer?.name}</div>
                              <div style={{ fontSize: '0.78rem', color: '#475569' }}>{ord.customer?.phone}</div>
                              <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                                {ord.shippingAddress?.city}, {ord.shippingAddress?.pincode}
                              </div>
                            </td>
                            <td style={{ padding: '14px' }}>
                              <div style={{ fontWeight: 650, color: '#1E293B' }}>
                                {ord.items?.[0]?.name}
                                {ord.items?.length > 1 && ` + ${ord.items.length - 1} more`}
                              </div>
                            </td>
                            <td style={{ padding: '14px', fontWeight: 900, color: '#1E293B' }}>
                              ₹{ord.total?.toLocaleString('en-IN')}
                            </td>
                            <td style={{ padding: '14px' }}>
                              <select
                                value={ord.orderStatus}
                                onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: '8px',
                                  fontSize: '0.8rem',
                                  fontWeight: 800,
                                  backgroundColor:
                                    ord.orderStatus === 'Delivered'
                                      ? '#DCFCE7'
                                      : ord.orderStatus === 'Shipped'
                                      ? '#E0F2FE'
                                      : ord.orderStatus === 'Cancelled'
                                      ? '#FEE2E2'
                                      : '#FFEDD5',
                                  color:
                                    ord.orderStatus === 'Delivered'
                                      ? '#15803D'
                                      : ord.orderStatus === 'Shipped'
                                      ? '#0369A1'
                                      : ord.orderStatus === 'Cancelled'
                                      ? '#B91C1C'
                                      : '#C2410C',
                                  border: '1px solid transparent',
                                  outline: 'none',
                                  cursor: 'pointer',
                                }}
                              >
                                <option value="Order Placed">Order Placed</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Processing and Assembly">Processing and Assembly</option>
                                <option value="Packed">Packed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td style={{ padding: '14px', textAlign: 'right' }}>
                              <button
                                onClick={() => setSelectedOrder(ord)}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#FFF7ED',
                                  border: '1px solid #FED7AA',
                                  borderRadius: '8px',
                                  color: '#EA580C',
                                  fontWeight: 750,
                                  fontSize: '0.8rem',
                                  cursor: 'pointer',
                                }}
                              >
                                Full Invoice
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: CONTACT US MANAGEMENT */}
          {activeTab === 'contact' && (
            <div>
              {/* Top Banner with Storefront Link */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  border: '1.5px solid #FED7AA',
                  marginBottom: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.18rem', fontWeight: 900, color: '#1E293B', margin: 0 }}>
                    Contact Us Management & Inquiries
                  </h3>
                  <div style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '2px' }}>
                    Update showroom phone, WhatsApp number, email, address, operating hours, and reply to customer inquiries.
                  </div>
                </div>

                <Link
                  href="/contact"
                  target="_blank"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#FFF7ED',
                    border: '1.5px solid #FED7AA',
                    color: '#EA580C',
                    textDecoration: 'none',
                    fontWeight: 750,
                    fontSize: '0.86rem',
                  }}
                >
                  <ExternalLink size={15} />
                  <span>View Customer Contact</span>
                </Link>
              </div>

              {/* SHOWROOM DETAILS CMS */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1.5px solid #FED7AA',
                  marginBottom: '24px',
                  boxShadow: '0 2px 8px rgba(249, 115, 22, 0.05)',
                }}
              >
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B', margin: '0 0 16px' }}>
                  Showroom Contact Details & Business Hours
                </h4>

                <form onSubmit={handleSaveSettings}>
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                      Physical Showroom Address *
                    </label>
                    <input
                      type="text"
                      value={siteSettings?.address || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #FED7AA',
                        fontSize: '0.92rem',
                        backgroundColor: '#FFFDF9',
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '18px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                        Primary Phone *
                      </label>
                      <input
                        type="text"
                        value={siteSettings?.phone || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #FED7AA', fontSize: '0.9rem', backgroundColor: '#FFFDF9' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                        WhatsApp Support Number *
                      </label>
                      <input
                        type="text"
                        value={siteSettings?.whatsapp || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, whatsapp: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #FED7AA', fontSize: '0.9rem', backgroundColor: '#FFFDF9' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                        Showroom Email *
                      </label>
                      <input
                        type="email"
                        value={siteSettings?.email || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #FED7AA', fontSize: '0.9rem', backgroundColor: '#FFFDF9' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                        Working Hours (Mon – Sat)
                      </label>
                      <input
                        type="text"
                        value={siteSettings?.openingHoursWeekdays || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, openingHoursWeekdays: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #FED7AA', fontSize: '0.9rem', backgroundColor: '#FFFDF9' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                        Working Hours (Sunday)
                      </label>
                      <input
                        type="text"
                        value={siteSettings?.openingHoursSunday || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, openingHoursSunday: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #FED7AA', fontSize: '0.9rem', backgroundColor: '#FFFDF9' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '22px' }}>
                    <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                      Google Maps Landmark Link (GPS Directions)
                    </label>
                    <input
                      type="text"
                      value={siteSettings?.googleMapsUrl || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, googleMapsUrl: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #FED7AA', fontSize: '0.9rem', backgroundColor: '#FFFDF9' }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      padding: '11px 24px',
                      backgroundColor: '#EA580C',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                    }}
                  >
                    Save Contact Details to MongoDB
                  </button>
                </form>
              </div>

              {/* CUSTOMER INQUIRIES & MESSAGES INBOX */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1.5px solid #FED7AA',
                  boxShadow: '0 2px 8px rgba(249, 115, 22, 0.05)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1E293B', margin: 0 }}>
                      Customer Inquiries Inbox ({enquiries.length})
                    </h4>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                      Directly submitted by customers from the /contact form
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>Filter:</span>
                    <select
                      value={enquiryStatusFilter}
                      onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid #FED7AA',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        backgroundColor: '#FFFDF9',
                      }}
                    >
                      <option value="All">All Inquiries</option>
                      <option value="New">New</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Spam">Spam</option>
                    </select>
                  </div>
                </div>

                {filteredEnquiries.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
                    <MessageSquare size={36} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                    <div style={{ fontWeight: 700 }}>No inquiries matching this filter.</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {filteredEnquiries.map((enq) => (
                      <div
                        key={enq._id}
                        style={{
                          backgroundColor: '#FFFDF9',
                          border: '1.5px solid #FED7AA',
                          borderRadius: '14px',
                          padding: '18px 20px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                          <div>
                            <span style={{ fontWeight: 800, color: '#1E293B', fontSize: '0.98rem' }}>{enq.name}</span>
                            <span style={{ margin: '0 8px', color: '#CBD5E1' }}>•</span>
                            <span style={{ color: '#EA580C', fontWeight: 750, fontSize: '0.85rem' }}>{enq.phone}</span>
                            <span style={{ margin: '0 8px', color: '#CBD5E1' }}>•</span>
                            <span style={{ color: '#64748B', fontSize: '0.85rem' }}>{enq.email}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            {/* Status Selector */}
                            <select
                              value={enq.status || 'New'}
                              onChange={(e) => handleUpdateEnquiryStatus(enq._id, e.target.value)}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '0.76rem',
                                fontWeight: 800,
                                backgroundColor:
                                  enq.status === 'Resolved'
                                    ? '#DCFCE7'
                                    : enq.status === 'In Progress'
                                    ? '#FEF3C7'
                                    : enq.status === 'Spam'
                                    ? '#FEE2E2'
                                    : '#FFEDD5',
                                color:
                                  enq.status === 'Resolved'
                                    ? '#15803D'
                                    : enq.status === 'In Progress'
                                    ? '#B45309'
                                    : enq.status === 'Spam'
                                    ? '#DC2626'
                                    : '#C2410C',
                                border: '1px solid transparent',
                                cursor: 'pointer',
                              }}
                            >
                              <option value="New">New</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved</option>
                              <option value="Spam">Spam</option>
                            </select>

                            <a
                              href={`https://wa.me/${(enq.phone || '').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(enq.name || '')},%20we%20received%20your%20message%20regarding%20Sri%20Rama%20Cycles.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                backgroundColor: '#25D366',
                                color: '#FFFFFF',
                                fontSize: '0.76rem',
                                fontWeight: 750,
                                textDecoration: 'none',
                              }}
                            >
                              <MessageCircle size={14} />
                              <span>WhatsApp</span>
                            </a>

                            <a
                              href={`tel:${(enq.phone || '').replace(/\s+/g, '')}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                backgroundColor: '#FFF7ED',
                                border: '1px solid #FED7AA',
                                color: '#EA580C',
                                fontSize: '0.76rem',
                                fontWeight: 750,
                                textDecoration: 'none',
                              }}
                            >
                              <Phone size={14} />
                              <span>Call</span>
                            </a>

                            <button
                              onClick={() => handleDeleteEnquiry(enq._id, enq.name)}
                              title="Delete inquiry"
                              style={{
                                padding: '5px 8px',
                                borderRadius: '6px',
                                backgroundColor: '#FEF2F2',
                                border: '1px solid #FECACA',
                                color: '#DC2626',
                                cursor: 'pointer',
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.84rem', fontWeight: 750, color: '#334155', marginBottom: '4px' }}>
                          Subject: {enq.subject || 'General Inquiry'}
                        </div>
                        <p style={{ fontSize: '0.88rem', color: '#57534E', lineHeight: 1.6, margin: 0 }}>
                          {enq.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS & SECURITY */}
          {activeTab === 'settings' && (
            <div style={{ maxWidth: '960px' }}>
              {/* Settings Sub-navigation Pills */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '22px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSettingsSubTab('general')}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontSize: '0.88rem',
                    fontWeight: settingsSubTab === 'general' ? 800 : 650,
                    backgroundColor: settingsSubTab === 'general' ? '#EA580C' : '#FFFFFF',
                    color: settingsSubTab === 'general' ? '#FFFFFF' : '#475569',
                    border: '1.5px solid #FED7AA',
                    cursor: 'pointer',
                  }}
                >
                  ⚙️ General Policies & Legal
                </button>
                <button
                  onClick={() => setSettingsSubTab('password')}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontSize: '0.88rem',
                    fontWeight: settingsSubTab === 'password' ? 800 : 650,
                    backgroundColor: settingsSubTab === 'password' ? '#EA580C' : '#FFFFFF',
                    color: settingsSubTab === 'password' ? '#FFFFFF' : '#475569',
                    border: '1.5px solid #FED7AA',
                    cursor: 'pointer',
                  }}
                >
                  🔒 Change Admin Password
                </button>
                <button
                  onClick={() => setSettingsSubTab('customers')}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontSize: '0.88rem',
                    fontWeight: settingsSubTab === 'customers' ? 800 : 650,
                    backgroundColor: settingsSubTab === 'customers' ? '#EA580C' : '#FFFFFF',
                    color: settingsSubTab === 'customers' ? '#FFFFFF' : '#475569',
                    border: '1.5px solid #FED7AA',
                    cursor: 'pointer',
                  }}
                >
                  👥 Customers Directory ({customers.length})
                </button>
              </div>

              {/* SUBTAB 1: GENERAL WEBSITE POLICIES */}
              {settingsSubTab === 'general' && siteSettings && (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '28px',
                    border: '1.5px solid #FED7AA',
                    boxShadow: '0 2px 8px rgba(249, 115, 22, 0.05)',
                  }}
                >
                  <div style={{ borderBottom: '1px solid #FED7AA', paddingBottom: '16px', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.18rem', fontWeight: 900, color: '#1E293B', margin: 0 }}>
                      Global Website Settings, Legal Policies & Footer
                    </h3>
                    <div style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '4px' }}>
                      Changes saved here are stored in MongoDB and update across every customer page.
                    </div>
                  </div>

                  <form onSubmit={handleSaveSettings}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '22px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>
                          Store Display Name *
                        </label>
                        <input
                          type="text"
                          value={siteSettings.storeName || ''}
                          onChange={(e) => setSiteSettings({ ...siteSettings, storeName: e.target.value })}
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #FED7AA', fontSize: '0.92rem', backgroundColor: '#FFFDF9' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>
                          Proprietor Name *
                        </label>
                        <input
                          type="text"
                          value={siteSettings.proprietor || ''}
                          onChange={(e) => setSiteSettings({ ...siteSettings, proprietor: e.target.value })}
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #FED7AA', fontSize: '0.92rem', backgroundColor: '#FFFDF9' }}
                        />
                      </div>
                    </div>

                    {/* Delivery & Warranty Policies */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '22px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>
                          🚚 Doorstep Delivery Policy Notice
                        </label>
                        <input
                          type="text"
                          value={siteSettings.deliveryNotice || ''}
                          onChange={(e) => setSiteSettings({ ...siteSettings, deliveryNotice: e.target.value })}
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #FED7AA', fontSize: '0.92rem', backgroundColor: '#FFFDF9' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>
                          🛡️ Showroom Frame Warranty Guarantee
                        </label>
                        <input
                          type="text"
                          value={siteSettings.warrantyNotice || ''}
                          onChange={(e) => setSiteSettings({ ...siteSettings, warrantyNotice: e.target.value })}
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #FED7AA', fontSize: '0.92rem', backgroundColor: '#FFFDF9' }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '26px' }}>
                      <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>
                        Footer Copyright Text
                      </label>
                      <input
                        type="text"
                        value={siteSettings.footerCopyright || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, footerCopyright: e.target.value })}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #FED7AA', fontSize: '0.92rem', backgroundColor: '#FFFDF9' }}
                      />
                    </div>

                    <button
                      type="submit"
                      style={{
                        padding: '12px 28px',
                        backgroundColor: '#EA580C',
                        color: '#FFFFFF',
                        borderRadius: '10px',
                        border: 'none',
                        fontWeight: 800,
                        fontSize: '0.94rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)',
                      }}
                    >
                      Save All Policies to Live Website
                    </button>
                  </form>
                </div>
              )}

              {/* SUBTAB 2: CHANGE ADMIN PASSWORD */}
              {settingsSubTab === 'password' && (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '28px',
                    border: '1.5px solid #FED7AA',
                    boxShadow: '0 2px 8px rgba(249, 115, 22, 0.05)',
                  }}
                >
                  <div style={{ borderBottom: '1px solid #FED7AA', paddingBottom: '16px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <KeyRound size={22} color="#EA580C" />
                      <h3 style={{ fontSize: '1.18rem', fontWeight: 900, color: '#1E293B', margin: 0 }}>
                        Change Admin Access Password
                      </h3>
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '4px' }}>
                      Update your CMS administration login password. Passwords are encrypted with bcrypt before saving to MongoDB.
                    </div>
                  </div>

                  {passwordMsg.text && (
                    <div
                      style={{
                        padding: '12px 16px',
                        borderRadius: '10px',
                        marginBottom: '20px',
                        backgroundColor: passwordMsg.isError ? '#FEF2F2' : '#DCFCE7',
                        border: `1.5px solid ${passwordMsg.isError ? '#FECACA' : '#86EFAC'}`,
                        color: passwordMsg.isError ? '#DC2626' : '#15803D',
                        fontSize: '0.88rem',
                        fontWeight: 750,
                      }}
                    >
                      {passwordMsg.text}
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} style={{ maxWidth: '480px' }}>
                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                        Current Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        placeholder="Enter current admin password"
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #FED7AA',
                          fontSize: '0.92rem',
                          backgroundColor: '#FFFDF9',
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                        New Password (minimum 6 characters) *
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        placeholder="Enter new strong password"
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #FED7AA',
                          fontSize: '0.92rem',
                          backgroundColor: '#FFFDF9',
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                        Confirm New Password *
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        placeholder="Re-enter new password"
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #FED7AA',
                          fontSize: '0.92rem',
                          backgroundColor: '#FFFDF9',
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={passwordLoading}
                      style={{
                        padding: '12px 26px',
                        backgroundColor: '#EA580C',
                        color: '#FFFFFF',
                        borderRadius: '10px',
                        border: 'none',
                        fontWeight: 800,
                        fontSize: '0.92rem',
                        cursor: passwordLoading ? 'not-allowed' : 'pointer',
                        opacity: passwordLoading ? 0.7 : 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <Lock size={16} />
                      <span>{passwordLoading ? 'Updating Password...' : 'Update Password'}</span>
                    </button>
                  </form>
                </div>
              )}

              {/* SUBTAB 3: CUSTOMERS DIRECTORY */}
              {settingsSubTab === 'customers' && (
                <div>
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '18px 24px',
                      border: '1.5px solid #FED7AA',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '14px',
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '1.08rem', fontWeight: 900, color: '#1E293B', margin: 0 }}>
                        Registered Customer Accounts Directory
                      </h4>
                      <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                        Customer account profiles, order counts, and lifetime showroom spend
                      </div>
                    </div>

                    <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                      <input
                        type="text"
                        placeholder="Search name, email, or phone..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px 9px 36px',
                          borderRadius: '8px',
                          border: '1.5px solid #FED7AA',
                          fontSize: '0.86rem',
                          outline: 'none',
                          backgroundColor: '#FFFDF9',
                        }}
                      />
                      <Search
                        size={15}
                        color="#94A3B8"
                        style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1.5px solid #FED7AA',
                      boxShadow: '0 2px 8px rgba(249, 115, 22, 0.05)',
                    }}
                  >
                    {filteredCustomers.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '48px 20px', color: '#94A3B8' }}>
                        <Users size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#64748B' }}>
                          No customers found
                        </div>
                      </div>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                          <thead>
                            <tr style={{ borderBottom: '1.5px solid #F1F5F9', color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                              <th style={{ padding: '12px 14px' }}>Customer Name</th>
                              <th style={{ padding: '12px 14px' }}>Contact Details</th>
                              <th style={{ padding: '12px 14px' }}>Total Orders</th>
                              <th style={{ padding: '12px 14px' }}>Lifetime Spend</th>
                              <th style={{ padding: '12px 14px' }}>Registered Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredCustomers.map((c) => (
                              <tr key={c._id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                                <td style={{ padding: '14px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div
                                      style={{
                                        width: '34px',
                                        height: '34px',
                                        borderRadius: '50%',
                                        backgroundColor: '#FFEDD5',
                                        color: '#EA580C',
                                        fontWeight: 900,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.82rem',
                                      }}
                                    >
                                      {c.name?.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div style={{ fontWeight: 800, color: '#1E293B' }}>{c.name}</div>
                                  </div>
                                </td>
                                <td style={{ padding: '14px' }}>
                                  <div style={{ color: '#475569' }}>{c.email}</div>
                                  <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{c.phone || 'No phone'}</div>
                                </td>
                                <td style={{ padding: '14px', fontWeight: 800, color: '#1E293B' }}>
                                  {c.orderCount || 0} orders
                                </td>
                                <td style={{ padding: '14px', fontWeight: 800, color: '#15803D' }}>
                                  ₹{(c.totalSpent || 0).toLocaleString('en-IN')}
                                </td>
                                <td style={{ padding: '14px', color: '#64748B' }}>
                                  {new Date(c.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* --- MODAL 1: ADD / EDIT PRODUCT (With Image Presets & Verified Categories) --- */}
      {productModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setProductModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              border: '2px solid #FED7AA',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #FED7AA', paddingBottom: '14px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1E293B', margin: 0 }}>
                {editingProduct ? 'Edit Product Details' : 'Add New Cycle or Spare Part to Showroom'}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 750, color: '#334155', marginBottom: '6px' }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Srirama Apex Pro 29T Mountain MTB"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #FED7AA', fontSize: '0.92rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 750, color: '#334155', marginBottom: '6px' }}>
                    Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #FED7AA', fontSize: '0.92rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 750, color: '#334155', marginBottom: '6px' }}>
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #FED7AA', fontSize: '0.92rem', backgroundColor: '#FFF' }}
                  >
                    {STANDARD_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    {categories
                      .filter((c) => !STANDARD_CATEGORIES.includes(c.name))
                      .map((c) => (
                        <option key={c._id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 750, color: '#334155', marginBottom: '6px' }}>
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #FED7AA', fontSize: '0.92rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 750, color: '#334155', marginBottom: '6px' }}>
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #FED7AA', fontSize: '0.92rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 750, color: '#334155', marginBottom: '6px' }}>
                    Stock Units *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #FED7AA', fontSize: '0.92rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 750, color: '#334155', marginBottom: '6px' }}>
                  Frame / Wheel Dimensions
                </label>
                <input
                  type="text"
                  placeholder="e.g. 18 Inch Alloy Frame / 29T Fast Rolling Kenda Tires"
                  value={productForm.size}
                  onChange={(e) => setProductForm({ ...productForm, size: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #FED7AA', fontSize: '0.92rem' }}
                />
              </div>

              {/* Verified Image Presets Selector */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 750, color: '#334155', marginBottom: '6px' }}>
                  Choose Verified Showroom Image Preset (or enter custom URL below):
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px', marginBottom: '10px' }}>
                  {CYCLE_IMAGE_PRESETS.map((preset) => {
                    const isSelected = productForm.images?.includes(preset.url);
                    return (
                      <div
                        key={preset.url}
                        onClick={() => setProductForm({ ...productForm, images: preset.url })}
                        style={{
                          border: isSelected ? '2px solid #EA580C' : '1px solid #FED7AA',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          backgroundColor: '#FFF7ED',
                          textAlign: 'center',
                          padding: '4px',
                        }}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          style={{ width: '100%', height: '56px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <div style={{ fontSize: '0.68rem', fontWeight: 750, color: '#1E293B', marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {preset.label}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>
                  Image URL(s) (Comma-separated for multiple images)
                </label>
                <input
                  type="text"
                  value={productForm.images}
                  onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #FED7AA', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 750, color: '#334155', marginBottom: '6px' }}>
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #FED7AA', fontSize: '0.92rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 700 }}>
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#EA580C' }}
                  />
                  <span>Featured Product (Showcased on Home Page)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 700 }}>
                  <input
                    type="checkbox"
                    checked={productForm.isBestSeller}
                    onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#EA580C' }}
                  />
                  <span>Best Seller Badge</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', cursor: 'pointer', fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#EA580C', color: '#FFF', cursor: 'pointer', fontWeight: 800 }}
                >
                  Save Product to Showroom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: ADD / EDIT CATEGORY --- */}
      {categoryModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setCategoryModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              border: '2px solid #FED7AA',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #FED7AA', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1E293B', margin: 0 }}>
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setCategoryModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 750, color: '#334155', marginBottom: '6px' }}>
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electric & Hybrid Cycles"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #FED7AA', fontSize: '0.92rem' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 750, color: '#334155', marginBottom: '6px' }}>
                  Category Image URL
                </label>
                <input
                  type="text"
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #FED7AA', fontSize: '0.92rem' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 750, color: '#334155', marginBottom: '6px' }}>
                  Description
                </label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #FED7AA', fontSize: '0.92rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', cursor: 'pointer', fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 22px', borderRadius: '8px', border: 'none', backgroundColor: '#EA580C', color: '#FFF', cursor: 'pointer', fontWeight: 800 }}
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: ADD / EDIT HERO SLIDE (With 1-Click Verified Image Selector) --- */}
      {slideModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setSlideModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '640px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              border: '2px solid #FED7AA',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #FED7AA', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1E293B', margin: 0 }}>
                {editingSlide ? 'Edit Hero Slider Item' : 'Add New Promotional Slide'}
              </h3>
              <button onClick={() => setSlideModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSlide}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 750, color: '#334155', marginBottom: '6px' }}>
                  Headline Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master the Road with Precision"
                  value={slideForm.title}
                  onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #FED7AA', fontSize: '0.92rem' }}
                />
              </div>

              {/* 1-Click Verified Image Selection */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 750, color: '#334155', marginBottom: '6px' }}>
                  Choose Verified Hero Image Preset:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))', gap: '8px', marginBottom: '10px' }}>
                  {CYCLE_IMAGE_PRESETS.map((preset) => {
                    const isSelected = slideForm.imageUrl === preset.url;
                    return (
                      <div
                        key={preset.url}
                        onClick={() => setSlideForm({ ...slideForm, imageUrl: preset.url })}
                        style={{
                          border: isSelected ? '2px solid #EA580C' : '1px solid #FED7AA',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          backgroundColor: '#FFF7ED',
                          textAlign: 'center',
                          padding: '4px',
                        }}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          style={{ width: '100%', height: '54px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <div style={{ fontSize: '0.66rem', fontWeight: 750, color: '#1E293B', marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {preset.label}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>
                  Hero Image URL *
                </label>
                <input
                  type="text"
                  required
                  value={slideForm.imageUrl}
                  onChange={(e) => setSlideForm({ ...slideForm, imageUrl: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #FED7AA', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 750, color: '#334155', marginBottom: '6px' }}>
                  Slide Description
                </label>
                <textarea
                  rows={2}
                  value={slideForm.description}
                  onChange={(e) => setSlideForm({ ...slideForm, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #FED7AA', fontSize: '0.92rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 750, color: '#334155', marginBottom: '6px' }}>
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={slideForm.buttonText}
                    onChange={(e) => setSlideForm({ ...slideForm, buttonText: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #FED7AA', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 750, color: '#334155', marginBottom: '6px' }}>
                    Button Link
                  </label>
                  <input
                    type="text"
                    value={slideForm.buttonLink}
                    onChange={(e) => setSlideForm({ ...slideForm, buttonLink: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #FED7AA', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 750, color: '#334155', marginBottom: '6px' }}>
                  Inspirational Cycling Quote
                </label>
                <input
                  type="text"
                  value={slideForm.quote}
                  onChange={(e) => setSlideForm({ ...slideForm, quote: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #FED7AA', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setSlideModalOpen(false)}
                  style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', cursor: 'pointer', fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 22px', borderRadius: '8px', border: 'none', backgroundColor: '#EA580C', color: '#FFF', cursor: 'pointer', fontWeight: 800 }}
                >
                  Publish Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 4: FULL INVOICE VIEW --- */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '620px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              border: '2px solid #FED7AA',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #FED7AA', paddingBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1E293B', margin: 0 }}>
                  Order Invoice #{selectedOrder.orderId}
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '18px', padding: '14px', borderRadius: '10px', backgroundColor: '#FFF7ED', border: '1px solid #FED7AA' }}>
              <div style={{ fontWeight: 800, color: '#9A3412', marginBottom: '4px' }}>Customer & Shipping Details:</div>
              <div style={{ fontWeight: 700, color: '#1E293B' }}>{selectedOrder.customer?.name}</div>
              <div style={{ fontSize: '0.84rem', color: '#475569' }}>Phone: {selectedOrder.customer?.phone} | Email: {selectedOrder.customer?.email}</div>
              <div style={{ fontSize: '0.84rem', color: '#475569', marginTop: '4px' }}>
                Address: {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>Purchased Bicycles & Spares:</div>
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <div>
                    <span style={{ fontWeight: 750, color: '#1E293B' }}>{item.name}</span>
                    <span style={{ fontSize: '0.8rem', color: '#64748B', marginLeft: '8px' }}>x{item.quantity || 1}</span>
                  </div>
                  <div style={{ fontWeight: 800, color: '#1E293B' }}>₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '2px solid #FED7AA', marginBottom: '20px' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#1E293B' }}>Total Amount Paid:</span>
              <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#EA580C' }}>₹{selectedOrder.total?.toLocaleString('en-IN')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#EA580C', color: '#FFF', fontWeight: 800, cursor: 'pointer' }}
              >
                Close Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 5: CUSTOM BRANDED CONFIRMATION DIALOG (Replaces window.confirm) --- */}
      {confirmDialog.isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(3px)',
          }}
          onClick={closeConfirmModal}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '26px',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              border: '2px solid #FED7AA',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={24} />
              </div>
              <h3 style={{ fontSize: '1.18rem', fontWeight: 900, color: '#1E293B', margin: 0 }}>
                {confirmDialog.title}
              </h3>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, margin: '0 0 22px' }}>
              {confirmDialog.message}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={closeConfirmModal}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#F8FAFC',
                  color: '#475569',
                  fontWeight: 750,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmDialog.onConfirm) confirmDialog.onConfirm();
                  closeConfirmModal();
                }}
                style={{
                  padding: '9px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .spin-icon {
          animation: spin 0.8s linear infinite;
        }
        @media (max-width: 820px) {
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
