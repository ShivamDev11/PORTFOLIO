import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  LogOut, 
  ChevronRight,
  Layers,
  Briefcase,
  Code2,
  Zap,
  Quote,
  RefreshCw
} from "lucide-react";
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  handleFirestoreError,
  OperationType,
  writeBatch
} from "../firebase";
import { initialProjects, initialSkills, initialExperiences, initialQuotes, initialServices } from "../constants";

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("projects");

  // Data states
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        // Check if user is admin (hardcoded for now as per rules)
        if (u.email === "dellusr688@gmail.com") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    const unsubProjects = onSnapshot(query(collection(db, "projects"), orderBy("order")), (snap) => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, "projects"));

    const unsubSkills = onSnapshot(query(collection(db, "skills"), orderBy("order")), (snap) => {
      setSkills(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, "skills"));

    const unsubExp = onSnapshot(query(collection(db, "experiences"), orderBy("order")), (snap) => {
      setExperiences(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, "experiences"));

    const unsubServices = onSnapshot(query(collection(db, "services"), orderBy("order")), (snap) => {
      setServices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, "services"));

    const unsubQuotes = onSnapshot(query(collection(db, "quotes"), orderBy("order")), (snap) => {
      setQuotes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, "quotes"));

    return () => {
      unsubProjects();
      unsubSkills();
      unsubExp();
      unsubServices();
      unsubQuotes();
    };
  }, [isAdmin]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => signOut(auth);

  const handleSave = async (collectionName: string) => {
    try {
      const { id, ...dataToSave } = formData;
      if (editingId) {
        await updateDoc(doc(db, collectionName, editingId), dataToSave);
      } else {
        await addDoc(collection(db, collectionName), { ...dataToSave, order: Date.now() });
      }
      setEditingId(null);
      setIsAdding(false);
      setFormData({});
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, collectionName);
    }
  };

  const handleDelete = async (collectionName: string, id: string) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, collectionName);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="glass-card p-12 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-6">Admin Access</h1>
          <p className="text-white/60 mb-8">Please sign in with your authorized Google account to manage your portfolio.</p>
          <button 
            onClick={handleLogin}
            className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors btn-glow"
          >
            Sign in with Google
          </button>
          {!isAdmin && user && (
            <p className="text-red-500 mt-4 text-sm">Access Denied. You are not authorized.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/5 bg-black/50 backdrop-blur-xl p-6 flex flex-col">
        <div className="text-xl font-bold mb-12 flex items-center gap-2">
          <Zap className="text-blue-500" size={20} />
          ADMIN PANEL
        </div>
        
        <nav className="space-y-2 flex-1">
          {[
            { id: "projects", label: "Projects", icon: Layers },
            { id: "skills", label: "Skills", icon: Code2 },
            { id: "experience", label: "Experience", icon: Briefcase },
            { id: "services", label: "Services", icon: Zap },
            { id: "quotes", label: "Quotes", icon: Quote },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setEditingId(null); setIsAdding(false); setFormData({}); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-white/40 hover:text-red-400 transition-colors text-sm font-medium"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold capitalize">{activeTab}</h2>
            <button 
              onClick={() => { setEditingId(null); setIsAdding(true); setFormData({}); }}
              className="px-6 py-2 bg-white text-black rounded-full text-xs font-bold flex items-center gap-2 hover:bg-blue-500 hover:text-white transition-all btn-glow"
            >
              <Plus size={14} />
              ADD NEW
            </button>
          </div>

          {/* Form */}
          {(editingId || isAdding) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 mb-12 border-blue-500/20"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">{editingId ? "Edit" : "Add New"} {activeTab}</h3>
                <button onClick={() => { setEditingId(null); setIsAdding(false); setFormData({}); }} className="text-white/40 hover:text-white"><X size={20} /></button>
              </div>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave(activeTab === "experience" ? "experiences" : activeTab);
                }}
                className="grid grid-cols-1 gap-6"
              >
                {activeTab === "projects" && (
                  <>
                    <input required className="admin-input" placeholder="Title" value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} />
                    <input required className="admin-input" placeholder="Tech Stack" value={formData.tech || ""} onChange={e => setFormData({...formData, tech: e.target.value})} />
                    <textarea required className="admin-input" placeholder="Description" rows={3} value={formData.desc || ""} onChange={e => setFormData({...formData, desc: e.target.value})} />
                    <input className="admin-input" placeholder="Live Link" value={formData.live || ""} onChange={e => setFormData({...formData, live: e.target.value})} />
                    <input className="admin-input" placeholder="GitHub Link" value={formData.github || ""} onChange={e => setFormData({...formData, github: e.target.value})} />
                  </>
                )}

                {activeTab === "skills" && (
                  <>
                    <input required className="admin-input" placeholder="Skill Name" value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <select required className="admin-input" value={formData.category || ""} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option value="">Select Category</option>
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="databases">Databases</option>
                      <option value="tools">Tools</option>
                    </select>
                  </>
                )}

                {activeTab === "experience" && (
                  <>
                    <input required className="admin-input" placeholder="Role" value={formData.role || ""} onChange={e => setFormData({...formData, role: e.target.value})} />
                    <input required className="admin-input" placeholder="Company" value={formData.company || ""} onChange={e => setFormData({...formData, company: e.target.value})} />
                    <input required className="admin-input" placeholder="Period" value={formData.period || ""} onChange={e => setFormData({...formData, period: e.target.value})} />
                    <textarea 
                      required
                      className="admin-input" 
                      placeholder="Points (comma separated)" 
                      rows={4} 
                      value={formData.points?.join(", ") || ""} 
                      onChange={e => setFormData({...formData, points: e.target.value.split(",").map((p: string) => p.trim())})} 
                    />
                  </>
                )}

                {activeTab === "services" && (
                  <>
                    <input required className="admin-input" placeholder="Service Title" value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} />
                    <textarea required className="admin-input" placeholder="Description" rows={3} value={formData.description || ""} onChange={e => setFormData({...formData, description: e.target.value})} />
                    <input required className="admin-input" placeholder="Price" value={formData.price || ""} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </>
                )}

                {activeTab === "quotes" && (
                  <textarea required className="admin-input" placeholder="Quote Text" rows={3} value={formData.text || ""} onChange={e => setFormData({...formData, text: e.target.value})} />
                )}

                <button 
                  type="submit"
                  className="py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors btn-glow"
                >
                  <Save size={18} />
                  SAVE CHANGES
                </button>
              </form>
            </motion.div>
          )}

          {/* List */}
          <div className="space-y-4">
            {(activeTab === "projects" ? projects : 
              activeTab === "skills" ? skills : 
              activeTab === "experience" ? experiences : 
              activeTab === "services" ? services : quotes).map((item: any) => (
              <div key={item.id} className="glass-card p-6 flex items-center justify-between group">
                <div>
                  <h4 className="font-bold text-lg">{item.title || item.name || item.role || item.text}</h4>
                  <p className="text-white/40 text-sm">{item.tech || item.category || item.company || item.price}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingId(item.id); setFormData(item); }} className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-blue-400 transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(activeTab === "experience" ? "experiences" : activeTab, item.id)} className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .admin-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px border rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          padding: 1rem;
          font-size: 0.875rem;
          color: white;
          transition: all 0.3s;
        }
        .admin-input:focus {
          outline: none;
          border-color: #3b82f6;
          background: rgba(255, 255, 255, 0.08);
        }
      `}</style>
    </div>
  );
}
