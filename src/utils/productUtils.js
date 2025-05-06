export const normalizeGPU = (gpuName) => {
    if (!gpuName) return "";
    return gpuName
      .replace(/Integrated\s*/i, "")
      .replace(/NVIDIA\s*/gi, "")
      .replace(/GeForce\s*/gi, "")
      .replace(/Intel\s*/gi, "")
      .replace(/®|™/g, "")
      .replace(/Graphics/i, "Graphics")
      .trim();
  };
  
  export const normalizeCPU = (cpuString) => {
    if (!cpuString) return "";
    const match = cpuString.match(/Intel® Core™ (i\d|Ultra \d)/i);
    return match ? `Intel® Core™ ${match[1]}` : cpuString.split(",")[0].trim();
  };
  
  export const normalizeSSD = (ssdString) => {
    if (!ssdString) return "";
    const match = ssdString.match(/(\d+(?:GB|TB))\s*(SSD)/i);
    return match ? `${match[1]} ${match[2]}` : ssdString.split(" ")[0].trim();
  };