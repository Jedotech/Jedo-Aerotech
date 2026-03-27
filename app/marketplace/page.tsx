// UPDATED: Added 'null' to the type definition to satisfy TypeScript
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  const handleInquire = (pn: string, model: string) => {
    setFormData(prev => ({ ...prev, partNumber: pn, aircraft: model }))
    // This will now pass the build check
    scrollToSection(rfqRef);
  }