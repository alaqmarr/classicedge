import { getContacts } from "@/app/actions/contact";
import { Mail, Phone, MapPin } from "lucide-react";
import { Suspense } from "react";
import { ContactForm } from "./ContactForm";

export default async function ContactPage() {
  const contacts = await getContacts();

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
        <p className="text-xl text-slate-400">We're here to answer any questions you have about our acrylic machines and how they can improve your production workflow.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Contact Information */}
        <div className="space-y-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">Our Offices</h2>
          
          {contacts.length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl text-slate-400">
              Please contact us via the form or check back later for our office locations.
            </div>
          ) : (
            contacts.map((contact) => (
              <div key={contact.id} className="glass-panel p-8 rounded-2xl space-y-6 hover:border-blue-500/30 transition-colors">
                <h3 className="text-2xl font-semibold text-blue-400">{contact.title}</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-slate-500 mb-1">Address</span>
                      <p className="text-slate-200 whitespace-pre-wrap">{contact.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-slate-500 mb-1">Phone</span>
                      <p className="text-slate-200">{contact.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-slate-500 mb-1">Email</span>
                      <p className="text-slate-200">{contact.email}</p>
                    </div>
                  </div>
                </div>

                {contact.mapEmbedUrl && (
                  <div className="pt-6 border-t border-white/10 mt-6">
                    <div 
                      className="w-full h-64 sm:h-72 rounded-xl overflow-hidden opacity-90 hover:opacity-100 transition-opacity duration-300 border border-white/10 [&>iframe]:w-full [&>iframe]:h-full"
                      dangerouslySetInnerHTML={{ __html: contact.mapEmbedUrl }}
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Contact Form */}
        <Suspense fallback={<div className="glass-panel p-8 lg:p-10 rounded-3xl h-96 flex items-center justify-center">Loading form...</div>}>
          <ContactForm />
        </Suspense>
      </div>
    </div>
  );
}
