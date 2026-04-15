import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  ExternalLink, 
  Code2, 
  Database, 
  Terminal, 
  Cpu, 
  Layers, 
  Award, 
  Briefcase, 
  GraduationCap,
  ChevronRight,
  Download,
  Send,
  Globe,
  Zap,
  DollarSign,
  MessageCircle,
  Menu,
  X
} from "lucide-react";

import { initialProjects, initialSkills, initialExperiences, initialQuotes, initialServices, toolLogos } from "../constants";
import { ErrorBoundary } from "./ErrorBoundary";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Admin from "./Admin";
import { db, collection, onSnapshot, query, orderBy } from "../firebase";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

function Portfolio() {
  const [activeSection, setActiveSection] = useState("about");
  const [currentQuote, setCurrentQuote] = useState(0);

  // Dynamic data states
  const [projectsData, setProjectsData] = useState<any[]>([]);
  const [skillsData, setSkillsData] = useState<any>({ frontend: [], backend: [], databases: [], tools: [] });
  const [experiencesData, setExperiencesData] = useState<any[]>([]);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [quotesData, setQuotesData] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubProjects = onSnapshot(query(collection(db, "projects"), orderBy("order")), (snap) => {
      const dbProjects = snap.docs.map(d => d.data());
      setProjectsData([...initialProjects, ...dbProjects]);
    });

    const unsubSkills = onSnapshot(query(collection(db, "skills"), orderBy("order")), (snap) => {
      const s: any = { ...initialSkills };
      snap.docs.forEach(d => {
        const data = d.data();
        if (s[data.category]) {
          if (!s[data.category].includes(data.name)) {
            s[data.category].push(data.name);
          }
        }
      });
      setSkillsData(s);
    });

    const unsubExp = onSnapshot(query(collection(db, "experiences"), orderBy("order")), (snap) => {
      const dbExp = snap.docs.map(d => d.data());
      setExperiencesData([...initialExperiences, ...dbExp]);
    });

    const unsubServices = onSnapshot(query(collection(db, "services"), orderBy("order")), (snap) => {
      const dbServices = snap.docs.map(d => d.data());
      setServicesData([...initialServices, ...dbServices]);
    });

    const unsubQuotes = onSnapshot(query(collection(db, "quotes"), orderBy("order")), (snap) => {
      const dbQuotes = snap.docs.map(d => ({ text: d.data().text }));
      setQuotesData([...initialQuotes, ...dbQuotes]);
    });

    return () => {
      unsubProjects();
      unsubSkills();
      unsubExp();
      unsubServices();
      unsubQuotes();
    };
  }, []);

  useEffect(() => {
    if (quotesData.length === 0) return;
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotesData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [quotesData]);

  const [formData, setFormData] = useState({
    name: "",
    websiteType: "Portfolio",
    techStack: "React + Tailwind",
    domain: "I need one",
    requirements: ""
  });

  const [hireMeData, setHireMeData] = useState({
    name: "",
    companyName: "",
    position: "",
    type: "Job",
    details: ""
  });

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `*Website Inquiry from Portfolio*%0A%0A*Name:* ${formData.name}%0A*Type:* ${formData.websiteType}%0A*Tech Stack:* ${formData.techStack}%0A*Domain:* ${formData.domain}%0A*Requirements:* ${formData.requirements}`;
    window.open(`https://wa.me/918976510159?text=${message}`, "_blank");
  };

  const handleHireMeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `*Hiring Inquiry from Portfolio*%0A%0A*Name:* ${hireMeData.name}%0A*Company:* ${hireMeData.companyName}%0A*Position:* ${hireMeData.position}%0A*Type:* ${hireMeData.type}%0A*Details:* ${hireMeData.details}`;
    window.open(`https://wa.me/918976510159?text=${message}`, "_blank");
  };

  const sections = ["About", "Skills", "Experience", "Projects", "Services", "Hire Me"];

  return (
    <ErrorBoundary>
      <div className="min-h-screen premium-gradient overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-black/20 border-b border-white/5">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-display font-bold tracking-tighter cursor-pointer"
          onClick={() => {
            setActiveSection("about");
            setIsMenuOpen(false);
          }}
        >
          SHIVAM<span className="text-blue-500">.</span>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-sm font-medium">
          {sections.map((item) => (
            <button 
              key={item} 
              onClick={() => setActiveSection(item.toLowerCase())}
              className={`transition-colors relative py-1 ${
                activeSection === item.toLowerCase() ? "text-white" : "text-white/40 hover:text-white"
              }`}
            >
              {item}
              {activeSection === item.toLowerCase() && (
                <motion.div 
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                />
              )}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 w-full bg-black/90 backdrop-blur-xl border-b border-white/10 md:hidden overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                {sections.map((item) => (
                  <button 
                    key={item} 
                    onClick={() => {
                      setActiveSection(item.toLowerCase());
                      setIsMenuOpen(false);
                    }}
                    className={`text-left py-2 text-lg font-medium transition-colors ${
                      activeSection === item.toLowerCase() ? "text-blue-500" : "text-white/60"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 min-h-[80vh] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {activeSection === "about" && (
            <motion.section 
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative flex flex-col items-center text-center py-20 overflow-hidden rounded-3xl"
            >
              {/* Tech Video Background */}
              <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover"
                >
                  <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-blue-and-purple-lines-9114-large.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
              </div>

              <div className="relative z-10">
                <div className="h-12 mb-6 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {quotesData.length > 0 && (
                      <motion.span
                        key={currentQuote}
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                        transition={{ 
                          duration: 1, 
                          ease: [0.22, 1, 0.36, 1] 
                        }}
                        className="text-blue-400 text-sm font-bold tracking-[0.3em] uppercase"
                      >
                        {quotesData[currentQuote].text.split("").map((char: string, i: number) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                          >
                            {char}
                          </motion.span>
                        ))}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold mb-6 leading-[0.9] tracking-tighter">
                  CHAUHAN <br />
                  <span className="text-gradient">SHIVAM</span>
                </h1>
                <p className="text-white/60 max-w-xl mx-auto text-lg mb-10 font-light leading-relaxed">
                  Passionate Web Developer building interactive web applications and AI-powered solutions. 
                  Specializing in React.js, Python, and PHP.
                </p>
                <div className="flex gap-4 justify-center">
                  <motion.a 
                    href="https://github.com/ShivamDev11"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    className="p-3 glass-card hover:bg-white/10 transition-colors btn-glow"
                  >
                    <Github size={20} />
                  </motion.a>
                  <motion.a 
                    href="https://www.linkedin.com/in/shivam-chauhan-2bb027353"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    className="p-3 glass-card hover:bg-white/10 transition-colors btn-glow"
                  >
                    <Linkedin size={20} />
                  </motion.a>
                  <motion.button 
                    whileHover={{ y: -2 }}
                    className="p-3 glass-card hover:bg-white/10 transition-colors btn-glow relative"
                    onClick={() => {
                      navigator.clipboard.writeText("shivamchauhan1106@gmail.com");
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                  >
                    <Mail size={20} />
                    <AnimatePresence>
                      {copied && (
                        <motion.span 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: -30 }}
                          exit={{ opacity: 0 }}
                          className="absolute left-1/2 -translate-x-1/2 text-[10px] bg-blue-500 text-white px-2 py-1 rounded-full font-bold"
                        >
                          COPIED!
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
            </motion.section>
          )}

          {activeSection === "skills" && (
            <motion.section 
              key="skills"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center gap-4 mb-12">
                <h2 className="text-3xl font-bold">Technical Arsenal</h2>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="md:col-span-2 p-8 glass-card flex flex-col justify-between"
                >
                  <div>
                    <div className="p-3 bg-blue-500/20 rounded-xl w-fit mb-6 text-blue-400">
                      <Code2 size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Frontend Mastery</h3>
                    <div className="flex flex-wrap gap-2">
                      {skillsData.frontend.map((s: string) => (
                        <span key={s} className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/70 border border-white/5">{s}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -5 }}
                  className="p-8 glass-card"
                >
                  <div className="p-3 bg-purple-500/20 rounded-xl w-fit mb-6 text-purple-400">
                    <Terminal size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Backend</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillsData.backend.map((s: string) => (
                      <span key={s} className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/70 border border-white/5">{s}</span>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -5 }}
                  className="p-8 glass-card"
                >
                  <div className="p-3 bg-green-500/20 rounded-xl w-fit mb-6 text-green-400">
                    <Database size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Databases</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillsData.databases.map((s: string) => (
                      <span key={s} className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/70 border border-white/5">{s}</span>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -5 }}
                  className="md:col-span-4 p-8 glass-card flex flex-col md:flex-row items-center justify-between gap-8"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Tools & Platforms</h3>
                    <p className="text-white/50 text-sm mb-6">The ecosystem I use to build and deploy high-performance applications.</p>
                    <div className="flex flex-wrap gap-4">
                      {skillsData.tools.map((s: string) => (
                        <motion.div 
                          key={s} 
                          whileHover={{ scale: 1.1 }}
                          className="p-3 bg-white/5 rounded-xl border border-white/5 group relative"
                          title={s}
                        >
                          <img 
                            src={toolLogos[s as keyof typeof toolLogos]} 
                            alt={s} 
                            className="w-8 h-8 object-contain transition-all"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const slug = s.toLowerCase().replace(/\s+/g, '');
                              (e.target as HTMLImageElement).src = `https://cdn.simpleicons.org/${slug}/white`;
                            }}
                          />
                          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-white text-black text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {s}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center p-4 glass-card min-w-[100px]">
                      <span className="text-2xl font-bold text-blue-400">10+</span>
                      <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Projects</span>
                    </div>
                    <div className="flex flex-col items-center p-4 glass-card min-w-[100px]">
                      <span className="text-2xl font-bold text-purple-400">2+</span>
                      <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Internships</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.section>
          )}

          {activeSection === "experience" && (
            <motion.section 
              key="experience"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center gap-4 mb-12">
                <h2 className="text-3xl font-bold">Professional Journey</h2>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <div className="space-y-6">
                {experiencesData.map((exp: any, i: number) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="p-8 glass-card relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Briefcase size={120} />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white">{exp.role}</h3>
                        <p className="text-blue-400 font-medium">{exp.company}</p>
                      </div>
                      <span className="px-4 py-1 bg-white/5 rounded-full text-xs text-white/40 border border-white/5 h-fit">
                        {exp.period}
                      </span>
                    </div>
                    <ul className="space-y-3">
                      {exp.points.map((p: string, j: number) => (
                        <li key={j} className="flex items-start gap-3 text-white/60 text-sm">
                          <ChevronRight size={16} className="text-blue-500 mt-0.5 shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {activeSection === "projects" && (
            <motion.section 
              key="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center gap-4 mb-12">
                <h2 className="text-3xl font-bold">Featured Works</h2>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projectsData.map((project: any, i: number) => (
                  <motion.div 
                    key={i}
                    whileHover={{ 
                      y: -10, 
                      scale: 1.02,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="p-8 glass-card group border border-white/5 hover:border-blue-500/30 transition-colors duration-500"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-white/5 rounded-xl text-white/80 group-hover:text-blue-400 transition-colors">
                        <Layers size={24} />
                      </div>
                      <div className="flex gap-3">
                        <motion.a 
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors btn-glow"
                          title="GitHub Repository"
                        >
                          <Github size={18} />
                        </motion.a>
                        <motion.a 
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-blue-400 transition-colors btn-glow"
                          title="Live Demo"
                        >
                          <ExternalLink size={18} />
                        </motion.a>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-white/50 text-sm mb-6 leading-relaxed">{project.desc}</p>
                    <div className="pt-6 border-t border-white/5">
                      <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-2">Technologies</p>
                      <p className="text-xs text-white/40 font-mono">{project.tech}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {activeSection === "services" && (
            <motion.section 
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center gap-4 mb-12">
                <h2 className="text-3xl font-bold">Services</h2>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Pricing & Info */}
                <div className="space-y-8">
                  <div className="glass-card p-8 border-blue-500/20 bg-blue-500/5">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <Zap className="text-blue-400" /> Service Packages
                    </h3>
                    <div className="space-y-6">
                      {servicesData.length > 0 ? servicesData.map((service: any, i: number) => (
                        <div key={i} className="flex justify-between items-start p-4 bg-white/5 rounded-xl border border-white/5">
                          <div>
                            <h4 className="font-bold text-white">{service.title}</h4>
                            <p className="text-xs text-white/40 mt-1">{service.description}</p>
                          </div>
                          <span className="text-blue-400 font-bold">{service.price}</span>
                        </div>
                      )) : (
                        <>
                          <div className="flex justify-between items-start p-4 bg-white/5 rounded-xl border border-white/5">
                            <div>
                              <h4 className="font-bold text-white">Starter Portfolio</h4>
                              <p className="text-xs text-white/40 mt-1">Single page, responsive, modern UI</p>
                            </div>
                            <span className="text-blue-400 font-bold">₹2,999+</span>
                          </div>
                          <div className="flex justify-between items-start p-4 bg-white/5 rounded-xl border border-white/5">
                            <div>
                              <h4 className="font-bold text-white">Business Website</h4>
                              <p className="text-xs text-white/40 mt-1">Multi-page, SEO optimized, contact forms</p>
                            </div>
                            <span className="text-blue-400 font-bold">₹7,999+</span>
                          </div>
                          <div className="flex justify-between items-start p-4 bg-white/5 rounded-xl border border-white/5">
                            <div>
                              <h4 className="font-bold text-white">E-Commerce Store</h4>
                              <p className="text-xs text-white/40 mt-1">Product catalog, cart, payment gateway</p>
                            </div>
                            <span className="text-blue-400 font-bold">₹14,999+</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-6 text-center">
                      <Globe className="mx-auto mb-3 text-purple-400" size={24} />
                      <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Domain</h4>
                      <p className="text-sm font-medium">.com / .in / .org</p>
                    </div>
                    <div className="glass-card p-6 text-center">
                      <Cpu className="mx-auto mb-3 text-green-400" size={24} />
                      <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Tech Stack</h4>
                      <p className="text-sm font-medium">React / PHP / Python</p>
                    </div>
                  </div>
                </div>

                {/* Inquiry Form */}
                <div className="glass-card p-8">
                  <h3 className="text-xl font-bold mb-6">Website Inquiry</h3>
                  <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-2 block">Your Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-2 block">Website Type</label>
                        <select 
                          className="w-full bg-premium-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                          value={formData.websiteType}
                          onChange={(e) => setFormData({...formData, websiteType: e.target.value})}
                        >
                          <option>Portfolio</option>
                          <option>Business</option>
                          <option>E-Commerce</option>
                          <option>Custom App</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-2 block">Tech Stack</label>
                        <select 
                          className="w-full bg-premium-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                          value={formData.techStack}
                          onChange={(e) => setFormData({...formData, techStack: e.target.value})}
                        >
                          <option>React + Tailwind</option>
                          <option>PHP + Bootstrap</option>
                          <option>Python + Flask</option>
                          <option>WordPress</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-2 block">Domain Requirement</label>
                      <select 
                        className="w-full bg-premium-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        value={formData.domain}
                        onChange={(e) => setFormData({...formData, domain: e.target.value})}
                      >
                        <option>I need a new domain</option>
                        <option>I already have a domain</option>
                        <option>Use a free subdomain</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-2 block">Additional Requirements</label>
                      <textarea 
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                        placeholder="Tell me more about your vision..."
                        value={formData.requirements}
                        onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                      />
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors btn-glow"
                    >
                      <MessageCircle size={18} />
                      SEND VIA WHATSAPP
                    </motion.button>
                  </form>
                </div>
              </div>
            </motion.section>
          )}

          {activeSection === "hire me" && (
            <motion.section 
              key="hire me"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center gap-4 mb-12">
                <h2 className="text-3xl font-bold">Hire Me</h2>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="max-w-2xl mx-auto glass-card p-8">
                <h3 className="text-xl font-bold mb-6">Company Hiring Inquiry</h3>
                <form onSubmit={handleHireMeSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-2 block">Your Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="John Doe"
                        value={hireMeData.name}
                        onChange={(e) => setHireMeData({...hireMeData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-2 block">Company Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Tech Corp"
                        value={hireMeData.companyName}
                        onChange={(e) => setHireMeData({...hireMeData, companyName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-2 block">Position / Role</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Senior Web Developer"
                      value={hireMeData.position}
                      onChange={(e) => setHireMeData({...hireMeData, position: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-2 block">Inquiry Type</label>
                    <select 
                      className="w-full bg-premium-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      value={hireMeData.type}
                      onChange={(e) => setHireMeData({...hireMeData, type: e.target.value})}
                    >
                      <option>Full-time Job</option>
                      <option>Internship</option>
                      <option>Contract / Freelance</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-2 block">Job Details / Requirements</label>
                    <textarea 
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                      placeholder="Tell me about the role and expectations..."
                      value={hireMeData.details}
                      onChange={(e) => setHireMeData({...hireMeData, details: e.target.value})}
                    />
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors btn-glow"
                  >
                    <MessageCircle size={18} />
                    SEND HIRING INQUIRY
                  </motion.button>
                </form>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Footer / Contact */}
        <footer className="pt-20 border-t border-white/10 text-center mt-auto">
          <h2 className="text-4xl font-bold mb-8">Let's build something <span className="text-gradient">extraordinary</span>.</h2>
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <a 
              href="mailto:shivamchauhan1106@gmail.com" 
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/5 btn-glow"
            >
              <Mail size={18} />
              shivamchauhan1106@gmail.com
            </a>
            <span className="flex items-center gap-2 text-white/60 px-4 py-2">
              <Phone size={18} />
              +91 8976510159
            </span>
          </div>
          <p className="text-white/20 text-xs uppercase tracking-[0.2em] font-bold mb-4">
            © 2026 Chauhan Shivam. Crafted with Passion.
          </p>
          <Link to="/admin" className="text-[10px] text-white/10 hover:text-blue-500 transition-colors uppercase tracking-widest font-bold">
            Admin Access
          </Link>
        </footer>
      </main>
    </div>
    </ErrorBoundary>
  );
}
