import { useState, useRef, useEffect } from 'react'
import { EnergyProfile } from '../App'

interface ResultsScreenProps {
  profile: EnergyProfile
  onRestart: () => void
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// Label mappings for display
const labelMaps = {
  heatingHours: {
    '0_2': '0–2 hours per day',
    '3_5': '3–5 hours per day',
    '6_8': '6–8 hours per day',
    '9_plus': '9+ hours per day'
  },
  hotWaterUsage: {
    'low': 'Low (1–2 uses per day)',
    'medium': 'Medium (3–5 uses per day)',
    'high': 'High (6+ uses per day)'
  },
  cookingHabits: {
    'light_microwave': '0–1 light meals (mostly microwave/toaster)',
    'normal_mixed': '1–2 full meals (mix of hob and oven)',
    'heavy_electric': '2–3+ cooked meals (electric hob/oven)',
    'gas_cooking': 'Mostly gas hob/oven'
  },
  lightingType: {
    'mostly_led': 'Mostly LED bulbs',
    'mixed': 'Mix of LED and older bulbs',
    'mostly_old': 'Mostly older bulbs (halogen/incandescent)',
    'unsure': 'Not sure'
  },
  applianceUsageAge: {
    'new_efficient': 'New efficient appliances (under 5 years)',
    'mixed_age': 'Mix of old and new appliances',
    'old_heavy_use': 'Mostly older appliances (10+ years)',
    'few_appliances': 'Limited appliance use'
  }
}

function ResultsScreen({ profile, onRestart }: ResultsScreenProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your EcoHome energy advisor. Based on your profile, I've prepared some recommendations above. Feel free to ask me anything about saving energy, reducing costs, or making your home more sustainable."
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const getLabel = (field: keyof typeof labelMaps, value: string | null): string => {
    if (!value) return 'Not provided'
    return labelMaps[field][value as keyof typeof labelMaps[typeof field]] || value
  }

  // Generate recommendations based on profile
  const getRecommendations = (): string[] => {
    const recs: string[] = []

    if (profile.heatingHours === '6_8' || profile.heatingHours === '9_plus') {
      recs.push('Your heating runs longer than average. Lowering your thermostat by 1°C can save around 8% on heating energy annually (£80-100/year).')
    }

    if (profile.hotWaterUsage === 'high') {
      recs.push('High hot water use detected. Consider efficient shower heads and slightly shorter showers to cut energy by 10-15%.')
    }

    if (profile.lightingType === 'mixed' || profile.lightingType === 'mostly_old') {
      recs.push('Switching fully to LED bulbs could reduce lighting electricity use by up to 80%, saving £40-65/year.')
    }

    if (profile.applianceUsageAge === 'old_heavy_use') {
      recs.push('Replacing older frequently used appliances (fridge, washing machine) with A-rated models can reduce electricity use by 30-50%.')
    }

    if (profile.cookingHabits === 'heavy_electric') {
      recs.push('Heavy electric cooking usage noted. Using lids on pots and batch cooking can reduce cooking energy by 25-35%.')
    }

    if (recs.length === 0) {
      recs.push('Your energy usage appears moderate. Consider a smart meter for real-time monitoring to identify further savings opportunities.')
    }

    return recs
  }

  // Generate AI prompt
  const generateAIPrompt = (): string => {
    return `User home energy profile:

- Heating hours per day: ${profile.heatingHours ? getLabel('heatingHours', profile.heatingHours) : 'not provided'}
- Hot water usage: ${profile.hotWaterUsage ? getLabel('hotWaterUsage', profile.hotWaterUsage) : 'not provided'}
- Meals & cooking appliances: ${profile.cookingHabits ? getLabel('cookingHabits', profile.cookingHabits) : 'not provided'}
- Main lighting type: ${profile.lightingType ? getLabel('lightingType', profile.lightingType) : 'not provided'}
- Daily appliance usage & age: ${profile.applianceUsageAge ? getLabel('applianceUsageAge', profile.applianceUsageAge) : 'not provided'}
- Extra notes from user: ${profile.extraQuestion || 'none'}

Task: Based on this profile, generate 3–5 personalised, practical energy-saving recommendations.
Focus on:
- Heating behaviour
- Hot water use
- Cooking and appliance efficiency
- Lighting choices
Use a friendly, encouraging tone and mention potential percentage or rough cost savings where possible.
Assume a temperate climate similar to the UK.`
  }

  // Generate quick wins based on profile
  const getQuickWins = (): string[] => {
    const tips: string[] = []

    if (profile.heatingHours) {
      if (profile.heatingHours === '9_plus' || profile.heatingHours === '6_8') {
        tips.push('Reduce heating time by 1 hour daily → Save £60-80/year')
      }
      tips.push('Lower thermostat by 1°C → Save £80-100/year')
    }

    if (profile.hotWaterUsage === 'high' || profile.hotWaterUsage === 'medium') {
      tips.push('Reduce shower time by 1 minute → Save £45/year per person')
    }

    if (profile.lightingType === 'mostly_old' || profile.lightingType === 'mixed') {
      tips.push('Switch to LED bulbs → Save £40-65/year')
    }

    if (profile.applianceUsageAge !== 'few_appliances') {
      tips.push('Unplug devices on standby → Save £65/year')
      tips.push('Wash clothes at 30°C → Save £30/year')
    }

    if (profile.cookingHabits === 'heavy_electric' || profile.cookingHabits === 'normal_mixed') {
      tips.push('Use lids on pots → 30% less cooking energy')
    }

    return tips.slice(0, 5)
  }

  const getBiggerInvestments = (): string[] => {
    const tips: string[] = []

    if (profile.heatingHours) {
      tips.push('Smart thermostat (Nest/Hive) → £150-220, saves £80-150/year')
      tips.push('Loft insulation top-up → Often FREE via ECO4')
    }

    if (profile.hotWaterUsage === 'high' || profile.hotWaterUsage === 'medium') {
      tips.push('Low-flow showerhead → £20, saves £70/year')
      tips.push('Hot water tank jacket → £25, saves £35/year')
    }

    if (profile.lightingType === 'mostly_old' || profile.lightingType === 'mixed') {
      tips.push('Full LED upgrade → £50-100, saves £150+/year')
    }

    if (profile.applianceUsageAge === 'old_heavy_use' || profile.applianceUsageAge === 'mixed_age') {
      tips.push('Replace old appliances with A-rated models')
    }

    tips.push('Solar panels → £6,000-8,000, saves £300-500/year')
    tips.push('Check ECO4 grant eligibility for free upgrades')

    return tips.slice(0, 5)
  }

  const generateResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase()

    // Greetings
    if (lowerMessage.match(/^(hi|hello|hey|hiya|good morning|good afternoon|good evening|howdy)[\s!?.]*$/)) {
      return `Hello! 👋 I'm your EcoHome energy advisor. Based on your profile, I can help you save money on your energy bills.\n\n**Your profile shows:**\n• Heating: ${getLabel('heatingHours', profile.heatingHours)}\n• Hot water: ${getLabel('hotWaterUsage', profile.hotWaterUsage)}\n• Lighting: ${getLabel('lightingType', profile.lightingType)}\n\nWhat would you like to know about? I can help with heating, water, lighting, appliances, grants, or solar panels!`
    }

    // Thanks/gratitude
    if (lowerMessage.match(/(thank|thanks|cheers|ta|appreciate|helpful)/)) {
      return `You're welcome! 😊 I'm happy to help you save energy and money.\n\nIs there anything else you'd like to know about? I can provide more details on:\n• Specific product recommendations\n• Government grants you might qualify for\n• Step-by-step guides for any of the tips\n• Cost calculations for your situation`
    }

    // How are you / personal questions
    if (lowerMessage.match(/(how are you|how're you|how do you do|what's up|wassup)/)) {
      return `I'm doing great, thanks for asking! 🌱 I'm here and ready to help you reduce your energy bills.\n\nBased on your answers, I estimate you could save **£150-600 per year** with the right changes. Would you like me to break down where those savings could come from?`
    }

    // What can you do / help
    if (lowerMessage.match(/(what can you|help me|what do you do|how can you help|what are you)/)) {
      return `I'm your personal energy advisor! Here's what I can help with:\n\n**💡 Quick Tips** - Free, instant savings\n**🏠 Home Improvements** - Investments that pay off\n**💷 Government Grants** - Free upgrades you might qualify for\n**📊 Cost Calculations** - Personalised savings estimates\n**🔧 Product Advice** - What to buy and where\n\n**Just ask me things like:**\n• "How do I reduce my heating bill?"\n• "What grants can I get?"\n• "Is my boiler too old?"\n• "Should I get solar panels?"\n\nWhat interests you most?`
    }

    // Heating related
    if (lowerMessage.includes('heat') || lowerMessage.includes('thermostat') || lowerMessage.includes('boiler') || lowerMessage.includes('radiator') || lowerMessage.includes('warm') || lowerMessage.includes('cold house')) {
      if (lowerMessage.includes('smart') || lowerMessage.includes('nest') || lowerMessage.includes('hive') || lowerMessage.includes('tado')) {
        return `Great question about smart thermostats! 🌡️\n\n**Top picks for UK homes:**\n\n**Nest Learning Thermostat (£219)**\n• Learns your schedule automatically\n• Saves 10-12% on heating\n• Works with most boilers\n\n**Hive Active Heating (£179)**\n• Great app, easy to use\n• British Gas support available\n• Reliable and well-tested\n\n**tado° (£199)**\n• Best for room-by-room control\n• Add smart radiator valves\n• Geofencing included\n\nBased on your heating usage (${getLabel('heatingHours', profile.heatingHours)}), a smart thermostat could save you **£80-150/year**. Most pay for themselves in 18 months!\n\nWant me to explain how to install one, or compare features in more detail?`
      }
      if (lowerMessage.includes('bill') || lowerMessage.includes('cost') || lowerMessage.includes('expensive') || lowerMessage.includes('reduce') || lowerMessage.includes('save') || lowerMessage.includes('lower') || lowerMessage.includes('cut')) {
        return `Let's cut your heating costs! 🔥 Based on your usage (${getLabel('heatingHours', profile.heatingHours)}), here's my plan:\n\n**FREE - Do Today:**\n• Turn thermostat down 1°C → **Save £80-100/year**\n• Only heat rooms you're using\n• Set timer to turn off 30 mins before bed\n• Close curtains at dusk to trap heat\n• Move furniture away from radiators\n\n**Under £50:**\n• Draught excluders (£15-30) → Save £25-45/year\n• Radiator reflector panels (£20) → Save £20-40/year\n• Bleed your radiators (free if DIY)\n\n**Bigger Savings:**\n• Smart thermostat (£150-220) → Save £80-150/year\n• Loft insulation → Often FREE via ECO4\n• Cavity wall insulation → Often FREE via ECO4\n\n**Your potential total savings: £200-400/year!**\n\nWhich of these would you like more detail on?`
      }
      if (lowerMessage.includes('boiler') || lowerMessage.includes('old') || lowerMessage.includes('replace') || lowerMessage.includes('new')) {
        return `Let's talk about your boiler! 🔧\n\n**Signs you need a new boiler:**\n• Over 15 years old\n• Frequent breakdowns\n• Yellow flame (should be blue)\n• Strange noises\n• Rising energy bills\n\n**New boiler costs:**\n• Combi boiler: £1,500-3,000 installed\n• System boiler: £2,000-3,500 installed\n• Potential savings: 20-30% on heating bills\n\n**FREE boiler schemes:**\n• ECO4: Free replacement if on benefits or low EPC\n• Boiler Upgrade Scheme: £7,500 towards heat pump\n\n**Heat pump alternative:**\n• Air source: £7,000-14,000 (minus £7,500 grant)\n• Running costs similar to gas\n• Zero carbon emissions\n\nWould you like help checking if you qualify for a free boiler replacement?`
      }
      return `Based on your heating usage (${getLabel('heatingHours', profile.heatingHours)}), here are my recommendations:\n\n**Quick wins (free):**\n• Turn thermostat down 1°C → saves £80-100/year\n• Set heating to turn off 30 mins before bed\n• Bleed radiators to remove air pockets\n• Use curtains to keep heat in\n\n**Bigger investments:**\n• Smart thermostat (£150-220) → saves £80-150/year\n• Check ECO4 eligibility for FREE insulation\n• Draught-proofing → saves £25-45/year\n\nHeating is usually 55% of energy bills, so this is where the biggest savings are!\n\nWould you like more details on any of these?`
    }

    // Water/shower related
    if (lowerMessage.includes('water') || lowerMessage.includes('shower') || lowerMessage.includes('bath') || lowerMessage.includes('tap') || lowerMessage.includes('hot water')) {
      return `Let's reduce your hot water costs! 🚿\n\nBased on your usage (${getLabel('hotWaterUsage', profile.hotWaterUsage)}):\n\n**Quick wins (free):**\n• Reduce shower by 1 min → Save £45/year per person\n• Fix dripping taps → Save £18/year per tap\n• Don't leave hot tap running while washing up\n\n**Smart purchases:**\n• Low-flow showerhead (£20) → Save £70/year\n• Hot water tank jacket (£25) → Save £35/year\n• Tap aerators (£5 each) → Save £30/year\n\n**Settings to check:**\n• Set cylinder to 60°C (safe and efficient)\n• Set combi boiler flow temp to 50-55°C\n• Use eco mode on dishwasher\n\n**Did you know?**\n• 4-min shower: 40 litres, ~8p\n• Average bath: 80 litres, ~16p\n• Power shower (8 mins): 136 litres, ~27p\n\nWhat would you like more detail on?`
    }

    // Grants and funding
    if (lowerMessage.includes('grant') || lowerMessage.includes('free') || lowerMessage.includes('eco4') || lowerMessage.includes('scheme') || lowerMessage.includes('government') || lowerMessage.includes('funding') || lowerMessage.includes('subsidis') || lowerMessage.includes('help pay')) {
      return `Great news - there's lots of help available! 💷\n\n**ECO4 Scheme (Energy Company Obligation):**\n✅ FREE loft insulation\n✅ FREE cavity wall insulation\n✅ FREE solid wall insulation\n✅ FREE boiler replacement\n**Eligibility:** Benefits recipients OR EPC rating D-G\n\n**Boiler Upgrade Scheme:**\n✅ £7,500 off air source heat pump\n✅ £5,000 off ground source heat pump\n**Eligibility:** Any homeowner with valid EPC\n\n**Great British Insulation Scheme:**\n✅ FREE/cheap insulation\n**Eligibility:** Council tax bands A-D (England)\n\n**Warm Home Discount:**\n✅ £150 off electricity bill\n**Eligibility:** Pension Credit or low income\n\n**How to apply:**\n1. Contact your energy supplier\n2. Visit gov.uk/energy-grants\n3. Check Simple Energy Advice website\n\nWould you like me to help you check which schemes you might qualify for?`
    }

    // Solar panels
    if (lowerMessage.includes('solar') || lowerMessage.includes('panel') || lowerMessage.includes('pv') || lowerMessage.includes('renewable') || lowerMessage.includes('generate')) {
      return `Let's talk solar! ☀️\n\n**Typical System (4kW):**\n• Cost: £6,000-8,000 installed\n• Annual savings: £300-500\n• Payback period: 10-15 years\n• Lifespan: 25-30 years\n\n**Earn money back:**\n• Smart Export Guarantee: 3-15p/kWh for excess\n• Best rates: Octopus (15p), Tesla (11p)\n\n**Is your home suitable?**\n✅ South-facing roof (SE/SW also good)\n✅ Minimal shading from trees/buildings\n✅ Roof in good condition\n✅ Space for 10-16 panels\n\n**Battery storage (optional):**\n• Cost: £2,500-5,000\n• Use more of your own electricity\n• Increases savings by 30-50%\n\n**Financing:**\n• 0% finance from many installers\n• Green loans from banks\n• Some local authority schemes\n\n**ROI calculation:**\nA 4kW system generates ~3,400 kWh/year\nAt 22p/kWh = £750 value\nPlus export payments = extra £100-200\n\nWant me to recommend trusted installers in your area?`
    }

    // Appliances
    if (lowerMessage.includes('appliance') || lowerMessage.includes('fridge') || lowerMessage.includes('washing') || lowerMessage.includes('dishwasher') || lowerMessage.includes('dryer') || lowerMessage.includes('tumble') || lowerMessage.includes('freezer') || lowerMessage.includes('oven') || lowerMessage.includes('microwave')) {
      return `Let's optimise your appliances! 🔌\n\nBased on your profile (${getLabel('applianceUsageAge', profile.applianceUsageAge)}):\n\n**Running costs (per year):**\n• Old fridge (10+ years): £80-100\n• New A-rated fridge: £30-40\n• Old washing machine: £45\n• New A-rated: £25\n• Tumble dryer: £70-100\n• Dishwasher: £40-55\n\n**Quick wins (free):**\n• Wash at 30°C → 40% less energy\n• Full loads only → save £30/year\n• Air dry when possible → save £70/year\n• Unplug standby → save £65/year\n\n**When to replace:**\n• Fridge/freezer over 10 years old\n• Washing machine over 8 years old\n• Any appliance rated C or below\n\n**Best energy ratings:**\n• Look for A or B (new scale)\n• Check EU energy label\n• Consider running cost, not just price\n\n**Pro tip:** Your fridge should be 3-5°C, freezer at -18°C. Every degree colder uses 5% more energy!\n\nWant specific product recommendations?`
    }

    // Lighting
    if (lowerMessage.includes('light') || lowerMessage.includes('led') || lowerMessage.includes('bulb') || lowerMessage.includes('lamp') || lowerMessage.includes('bright')) {
      return `Let's brighten up your savings! 💡\n\nBased on your lighting (${getLabel('lightingType', profile.lightingType)}):\n\n**Annual cost per bulb (4hrs/day):**\n• 60W incandescent: £14/year\n• 42W halogen: £10/year\n• 10W LED equivalent: £2.40/year\n\n**If you have 20 bulbs:**\n• Old bulbs: ~£200-280/year\n• All LEDs: ~£48/year\n• **Savings: £150-230/year!**\n\n**Choosing LEDs:**\n• Warm white (2700K) → living rooms, bedrooms\n• Cool white (4000K) → kitchen, bathroom\n• Daylight (5000K+) → offices, workshops\n• Check lumens, not watts (800lm ≈ 60W old bulb)\n\n**Smart additions:**\n• Motion sensors for hallways: £15-30\n• Timer switches: £10-20\n• Smart bulbs: £8-15 each\n\n**Best brands:**\n• Philips, IKEA, Osram, TCP\n• Avoid very cheap unbranded ones\n\nLED bulbs last 15-25 years, so this is a one-time investment!\n\nWant help choosing the right bulbs for each room?`
    }

    // Insulation
    if (lowerMessage.includes('insulat') || lowerMessage.includes('draft') || lowerMessage.includes('draught') || lowerMessage.includes('cold') || lowerMessage.includes('loft') || lowerMessage.includes('wall') || lowerMessage.includes('window')) {
      return `Insulation is one of the best investments! 🏠\n\n**Savings by type:**\n• Loft insulation (270mm): **£255/year**\n• Cavity wall insulation: **£295/year**\n• Solid wall insulation: **£400/year**\n• Floor insulation: **£70/year**\n• Draught-proofing: **£45/year**\n\n**Costs & payback:**\n• Loft: £300-400 (often FREE) → 2 year payback\n• Cavity wall: £400-600 (often FREE) → 2 years\n• Solid wall: £8,000-15,000 → 15-20 years\n\n**FREE insulation:**\nECO4 scheme offers FREE insulation if you:\n• Receive certain benefits, OR\n• Have an EPC rating of D, E, F or G\n\n**DIY draught-proofing:**\n• Door excluders: £10-30\n• Letterbox brush: £5\n• Chimney balloon: £20\n• Window film: £30\n• Keyhole covers: £2\n\n**Check your loft:**\nShould be 270mm (10.5 inches) deep. If you can see the joists, you need more!\n\nWant me to help you check if you qualify for free insulation?`
    }

    // Bills and costs
    if (lowerMessage.includes('bill') || lowerMessage.includes('cost') || lowerMessage.includes('expensive') || lowerMessage.includes('price') || lowerMessage.includes('tariff') || lowerMessage.includes('switch') || lowerMessage.includes('supplier') || lowerMessage.includes('pay')) {
      return `Let's tackle those bills! 💰\n\n**Average UK costs (2024):**\n• Electricity: 22p per kWh\n• Gas: 5p per kWh\n• Average annual bill: £1,834\n\n**Immediate actions:**\n\n1️⃣ **Check your tariff**\n• Compare on Uswitch, MoneySupermarket\n• Fixed deals can save £100-200/year\n• Check exit fees before switching\n\n2️⃣ **Get a smart meter**\n• Free installation from your supplier\n• See real-time usage\n• More accurate bills\n\n3️⃣ **Payment method**\n• Direct debit: 5-7% cheaper\n• Monthly beats quarterly\n\n**Based on your profile:**\n${profile.heatingHours === '9_plus' || profile.heatingHours === '6_8' ? '• Heating is your biggest opportunity - see my heating tips!' : ''}\n${profile.lightingType === 'mostly_old' || profile.lightingType === 'mixed' ? '• LED switch could save £150+/year' : ''}\n${profile.applianceUsageAge === 'old_heavy_use' ? '• Old appliances may be costing you £100+/year extra' : ''}\n\n**If struggling to pay:**\n• Warm Home Discount: £150 off\n• Priority Services Register (free)\n• Contact supplier for payment plan\n\nWant me to estimate your potential savings?`
    }

    // Energy saving general
    if (lowerMessage.includes('save energy') || lowerMessage.includes('saving energy') || lowerMessage.includes('energy saving') || lowerMessage.includes('reduce energy') || lowerMessage.includes('use less') || lowerMessage.includes('cut energy')) {
      return `Here's your complete energy-saving plan! 🌱\n\n**Based on your profile, focus on these:**\n\n**1. Heating (55% of bills)**\n${profile.heatingHours ? `You heat for ${getLabel('heatingHours', profile.heatingHours)}` : 'Heating info not provided'}\n• Thermostat down 1°C = £80-100 saved\n• Smart thermostat = £80-150 saved\n\n**2. Hot Water (17% of bills)**\n${profile.hotWaterUsage ? `Your usage: ${getLabel('hotWaterUsage', profile.hotWaterUsage)}` : 'Usage not specified'}\n• Shorter showers = £45/person saved\n• Low-flow showerhead = £70 saved\n\n**3. Appliances (15% of bills)**\n${profile.applianceUsageAge ? `Status: ${getLabel('applianceUsageAge', profile.applianceUsageAge)}` : 'Status not specified'}\n• Kill standby = £65 saved\n• Wash at 30°C = £30 saved\n\n**4. Lighting (5% of bills)**\n${profile.lightingType ? `Type: ${getLabel('lightingType', profile.lightingType)}` : 'Type not specified'}\n• Full LED switch = £150+ saved\n\n**Your potential total: £300-600/year!**\n\nWant me to create a step-by-step action plan for you?`
    }

    // Tips / advice / recommendations
    if (lowerMessage.includes('tip') || lowerMessage.includes('advice') || lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('idea') || lowerMessage.includes('what should')) {
      return `Here are my top personalised tips for you! 💡\n\n**Your Quick Wins (do today, free):**\n1. ${profile.heatingHours === '9_plus' || profile.heatingHours === '6_8' ? 'Reduce heating by 1 hour → £60-80/year' : 'Turn thermostat down 1°C → £80-100/year'}\n2. ${profile.hotWaterUsage === 'high' ? 'Shorter showers → £45/person/year' : 'Fix any dripping taps → £18/tap/year'}\n3. ${profile.lightingType === 'mostly_old' ? 'Replace most-used bulbs with LED first' : 'Turn off lights when leaving rooms'}\n4. Unplug standby devices → £65/year\n5. Only boil the water you need → £13/year\n\n**This Week:**\n• Check your energy tariff - could save £200/year\n• Bleed your radiators\n• Check loft insulation depth\n\n**This Month:**\n• Apply for ECO4 grants (potentially free insulation)\n• Consider a smart thermostat\n• Replace any bulbs over 5 years old with LED\n\nWant me to go deeper on any of these?`
    }

    // Default / fallback - more helpful
    return `Great question! Let me help you with that. 🌱\n\n**Based on your energy profile:**\n• Heating: ${getLabel('heatingHours', profile.heatingHours)}\n• Hot water: ${getLabel('hotWaterUsage', profile.hotWaterUsage)}\n• Cooking: ${getLabel('cookingHabits', profile.cookingHabits)}\n• Lighting: ${getLabel('lightingType', profile.lightingType)}\n• Appliances: ${getLabel('applianceUsageAge', profile.applianceUsageAge)}\n\n**I can help you with:**\n• 🔥 Heating costs and efficiency\n• 🚿 Hot water savings\n• 💡 Lighting upgrades\n• 🔌 Appliance efficiency\n• 💷 Government grants (ECO4, etc.)\n• ☀️ Solar panels\n• 🏠 Insulation options\n• 💰 Bill reduction strategies\n\n**Try asking:**\n• "How can I reduce my heating bill?"\n• "What grants am I eligible for?"\n• "Should I get solar panels?"\n• "Are my appliances too old?"\n• "Give me your best tips"\n\nWhat would you like to explore?`
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage = inputMessage.trim()
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setInputMessage('')
    setIsTyping(true)

    setTimeout(() => {
      const response = generateResponse(userMessage)
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }])
      setIsTyping(false)
    }, 800 + Math.random() * 700)
  }

  const quickWins = getQuickWins()
  const biggerInvestments = getBiggerInvestments()
  const recommendations = getRecommendations()
  const aiPrompt = generateAIPrompt()

  return (
    <div style={{ width: '100%' }}>
      {/* Main Layout - Side by Side Equal Width */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        width: '100%',
        alignItems: 'stretch'
      }}>
        {/* Left Column - Combined Recommendations */}
        <div className="card border-0">
          <div className="card-body" style={{ padding: '2.5rem' }}>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: '1.6rem',
              fontWeight: 400,
              color: '#3d4f3f',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              Your Energy Savings Plan
            </h2>

            {/* Quick Wins Section */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.25rem' }}>⚡</span>
                <h3 style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  color: '#3d4f3f',
                  margin: 0
                }}>
                  Free Quick Wins
                </h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {quickWins.map((tip, idx) => (
                  <li key={idx} style={{
                    padding: '0.6rem 0',
                    borderBottom: idx < quickWins.length - 1 ? '1px solid rgba(184, 196, 184, 0.2)' : 'none',
                    fontSize: '0.9rem',
                    color: '#4a4a4a',
                    lineHeight: 1.5
                  }}>
                    <span style={{ color: '#5a6b5c', marginRight: '0.5rem' }}>•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Bigger Investments Section */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.25rem' }}>🏠</span>
                <h3 style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  color: '#3d4f3f',
                  margin: 0
                }}>
                  Smart Investments
                </h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {biggerInvestments.map((tip, idx) => (
                  <li key={idx} style={{
                    padding: '0.6rem 0',
                    borderBottom: idx < biggerInvestments.length - 1 ? '1px solid rgba(184, 196, 184, 0.2)' : 'none',
                    fontSize: '0.9rem',
                    color: '#4a4a4a',
                    lineHeight: 1.5
                  }}>
                    <span style={{ color: '#5a6b5c', marginRight: '0.5rem' }}>•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Total Savings */}
            <div style={{
              padding: '1.25rem',
              background: 'rgba(184, 196, 184, 0.15)',
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              <p style={{ fontSize: '0.65rem', color: '#8a9a8c', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Potential Savings</p>
              <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.8rem', color: '#3d4f3f', margin: 0 }}>£300-£600/year</p>
            </div>

            {/* AI Prompt Log */}
            <details style={{ marginTop: '1rem' }}>
              <summary style={{
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#5a6b5c',
                cursor: 'pointer',
                padding: '0.75rem',
                background: 'rgba(184, 196, 184, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>📋</span> AI Prompt Log
              </summary>
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: '#1a1a1a',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: '#00ff00',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6,
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                <div style={{ color: '#888', marginBottom: '0.5rem' }}>// EcoHome AI Prompt Generator v1.0</div>
                <div style={{ color: '#888', marginBottom: '1rem' }}>// Generated: {new Date().toLocaleString()}</div>
                <div style={{ color: '#00ff00' }}>{aiPrompt}</div>
              </div>
            </details>
          </div>
        </div>

        {/* Right Column - Chat */}
        <div className="card border-0">
          <div className="card-body" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', minHeight: '500px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #5a6b5c 0%, #3d4f3f 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#faf9f6" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div>
              <h3 style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: '1.4rem',
                fontWeight: 400,
                color: '#3d4f3f',
                margin: 0
              }}>
                Energy Advisor
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#8a9a8c', margin: 0 }}>
                Ask me anything about saving energy
              </p>
            </div>
          </div>

          {/* Quick Suggestion Buttons */}
          {chatMessages.length === 1 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              {[
                'Tell me about grants',
                'Smart thermostats',
                'Solar panels',
                'Reduce heating costs'
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setChatMessages(prev => [...prev, { role: 'user', content: suggestion }])
                    setIsTyping(true)
                    setTimeout(() => {
                      const response = generateResponse(suggestion)
                      setChatMessages(prev => [...prev, { role: 'assistant', content: response }])
                      setIsTyping(false)
                    }, 800 + Math.random() * 700)
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.8rem',
                    background: 'transparent',
                    border: '1px solid #b8c4b8',
                    color: '#5a6b5c',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderRadius: '20px'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#5a6b5c'
                    e.currentTarget.style.color = '#faf9f6'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#5a6b5c'
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Chat Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            marginBottom: '1.5rem',
            padding: '1.5rem',
            background: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(184, 196, 184, 0.3)'
          }}>
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '1rem'
                }}
              >
                <div style={{
                  maxWidth: '85%',
                  padding: '1rem 1.25rem',
                  background: msg.role === 'user' ? '#3d4f3f' : 'rgba(184, 196, 184, 0.3)',
                  color: msg.role === 'user' ? '#faf9f6' : '#3d4f3f',
                  fontSize: '0.9rem',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-line',
                  borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px'
                }}
                dangerouslySetInnerHTML={{
                  __html: msg.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br/>')
                }}
                />
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '1rem 1.25rem',
                  background: 'rgba(184, 196, 184, 0.3)',
                  color: '#8a9a8c',
                  fontSize: '0.9rem',
                  display: 'flex',
                  gap: '4px',
                  borderRadius: '18px 18px 18px 4px'
                }}>
                  <span style={{ animation: 'pulse 1s infinite' }}>●</span>
                  <span style={{ animation: 'pulse 1s infinite 0.2s' }}>●</span>
                  <span style={{ animation: 'pulse 1s infinite 0.4s' }}>●</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your question here..."
              style={{
                flex: 1,
                padding: '1rem 1.25rem',
                border: '1px solid #b8c4b8',
                background: 'rgba(255,255,255,0.9)',
                fontSize: '1rem',
                outline: 'none',
                borderRadius: '25px'
              }}
            />
            <button
              onClick={handleSendMessage}
              className="btn btn-primary"
              style={{ padding: '1rem 2rem', fontSize: '0.8rem', borderRadius: '25px' }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default ResultsScreen
