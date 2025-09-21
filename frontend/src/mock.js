import { Camera, Wand2, Share2, ShoppingBag, Smartphone, Sparkles } from "lucide-react";

export const mockData = {
  // Hero section images
  heroMockup: "https://images.unsplash.com/photo-1629697776275-725482b486f7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwzfHxtb2JpbGUlMjBhcHAlMjBtb2NrdXB8ZW58MHx8fHwxNzU4Mzg1MDMxfDA&ixlib=rb-4.1.0&q=85",
  heroBackground: "https://images.unsplash.com/photo-1707742984673-ae30d982bdec?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBncmFkaWVudCUyMGJhY2tncm91bmR8ZW58MHx8fHwxNzU4NDY5Nzk1fDA&ixlib=rb-4.1.0&q=85",

  // How it works steps
  howItWorks: [
    {
      id: 1,
      icon: Camera,
      title: "Upload Your Photo",
      description: "Take a clear photo of yourself or upload an existing one from your gallery."
    },
    {
      id: 2,
      icon: Wand2,
      title: "Choose Clothing",
      description: "Browse our catalog or upload a link to any clothing item you want to try on."
    },
    {
      id: 3,
      icon: Sparkles,
      title: "See Magic Happen",
      description: "Our AI instantly generates a realistic image of you wearing the selected outfit."
    }
  ],

  // Features with images
  features: [
    {
      icon: Wand2,
      title: "AI-Powered Virtual Try-On",
      description: "Experience cutting-edge artificial intelligence that creates realistic try-on images in seconds. Our advanced models understand body proportions and fabric physics.",
      image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZ3xlbnwwfHx8fDE3NTg0Njk3NzJ8MA&ixlib=rb-4.1.0&q=85"
    },
    {
      icon: Share2,
      title: "Share Your Looks",
      description: "Show off your virtual outfits with friends and family. Get feedback before making your purchase decision and build your style community.",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwyfHxmYXNoaW9ufGVufDB8fHx8MTc1ODQ2OTc2Nnww&ixlib=rb-4.1.0&q=85"
    },
    {
      icon: ShoppingBag,
      title: "Shop Instantly",
      description: "Love what you see? Purchase directly through the app with one-click shopping. We partner with thousands of retailers worldwide.",
      image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwzfHxjbG90aGluZ3xlbnwwfHx8fDE3NTg0Njk3NzJ8MA&ixlib=rb-4.1.0&q=85"
    }
  ],

  // App screenshots for preview section
  appScreenshots: [
    {
      title: "Home Screen",
      description: "Clean, intuitive interface with personalized recommendations",
      image: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHw0fHxhcHAlMjBpbnRlcmZhY2V8ZW58MHx8fHwxNzU4NDY5NzQ0fDA&ixlib=rb-4.1.0&q=85"
    },
    {
      title: "Try-On Studio",
      description: "Advanced AI technology creates realistic virtual try-ons",
      image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZ3xlbnwwfHx8fDE3NTg0Njk3NzJ8MA&ixlib=rb-4.1.0&q=85"
    },
    {
      title: "Social Features",
      description: "Share looks and get feedback from your style community",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwyfHxmYXNoaW9ufGVufDB8fHx8MTc1ODQ2OTc2Nnww&ixlib=rb-4.1.0&q=85"
    }
  ],

  // User testimonials
  testimonials: [
    {
      name: "Sarah Johnson",
      role: "Fashion Enthusiast",
      text: "TryOnAI has completely changed how I shop online. I can see exactly how clothes will look on me before buying. No more returns!"
    },
    {
      name: "Mike Chen",
      role: "Busy Professional",
      text: "As someone who doesn't have time to shop in stores, this app is a game-changer. The virtual try-on is incredibly accurate."
    },
    {
      name: "Emily Rodriguez",
      role: "Style Blogger",
      text: "I use TryOnAI to create content for my blog. The results are so realistic that my followers can't believe it's virtual!"
    },
    {
      name: "David Park",
      role: "Student",
      text: "Perfect for someone on a budget like me. I can try before I buy and make sure I love everything I purchase."
    },
    {
      name: "Lisa Wang",
      role: "Working Mom",
      text: "Shopping with kids is impossible, but TryOnAI lets me try on clothes from home. It's saved me so much time and money."
    },
    {
      name: "James Wilson",
      role: "Tech Professional",
      text: "The AI technology behind this app is impressive. The virtual try-ons are surprisingly accurate and detailed."
    }
  ]
};