const { serviceCategories } = require('../models/Service');

// 🟢 Create a New Service
exports.createService = async (req, res) => {
  try {
    const { title, description, price, category, location, hasTransportVehicle, agent } = req.body;

    if (category === 'House Moving and Transfer Assistant' || category === 'Transportation') {
      if (hasTransportVehicle === undefined) {
        return res.status(400).json({ success: false, message: 'Please specify if you have a transport vehicle.' });
      }
    }

    const service = new Service({
      title,
      description,
      price,
      category,
      provider: req.user.id, // Logged-in user is the provider
      location,
      hasTransportVehicle: hasTransportVehicle || false,
      agent: agent || null
    });
    await service.save();
    res.status(201).json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Service creation failed', error });
  }
};

// 🔵 Get All Services
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).populate('provider agent', 'name email');
    res.status(200).json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch services', error });
  }
};

// 🟡 Get a Single Service
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('provider agent', 'name email');
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.status(200).json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching service', error });
  }
};

// 🟠 Update Service (Only Provider)
exports.updateService = async (req, res) => {
  try {
    const { title, description, price, category, location, isActive, agent, hasTransportVehicle } = req.body;
    const service = await Service.findById(req.params.id);

    if (!service || service.provider.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update' });
    }

    service.title = title || service.title;
    service.description = description || service.description;
    service.price = price || service.price;
    service.category = category || service.category;
    service.location = location || service.location;
    service.isActive = isActive !== undefined ? isActive : service.isActive;
    service.agent = agent || service.agent;
    service.hasTransportVehicle = hasTransportVehicle !== undefined ? hasTransportVehicle : service.hasTransportVehicle;

    await service.save();
    res.status(200).json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed', error });
  }
};

// 🔴 Delete Service (Only Provider)
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service || service.provider.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete' });
    }

    await service.remove();
    res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete service', error });
  }
};
