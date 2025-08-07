// Sample reading passages for the app
export const passages = [
  {
    id: 1,
    title: "The Rainbow Fish",
    difficulty: "beginner",
    wordCount: 150,
    text: "A long way out in the deep blue sea there lived a fish. Not just an ordinary fish, but the most beautiful fish in the entire ocean. His scales were every shade of blue and green and purple, with sparkling silver scales among them. The other fish were amazed at his beauty. They called him Rainbow Fish. 'Come on, Rainbow Fish,' they would call. 'Come and play with us!' But the Rainbow Fish would just glide past, proud and silent, letting his scales shimmer. He was too proud to answer. One day, a little blue fish followed behind him. 'Rainbow Fish,' he called, 'wait for me! Please give me one of your shiny scales. They are so wonderful, and you have so many.' 'Who do you think you are?' cried the Rainbow Fish. 'Get away from me!' Shocked, the little blue fish swam away."
  },
  {
    id: 2,
    title: "The Science of Stars",
    difficulty: "intermediate",
    wordCount: 200,
    text: "Stars are massive, luminous spheres of plasma held together by their own gravity. The nearest star to Earth is the Sun, which is the source of most of the energy on the planet. Other stars are visible from Earth during the night, appearing as a multitude of fixed luminous points in the sky due to their immense distance from Earth. Historically, the most prominent stars were grouped into constellations and asterisms, and the brightest stars gained proper names. Astronomers have assembled star catalogues that identify the known stars and provide standardized stellar designations. The observable universe contains an estimated 10^24 stars, but most are invisible to the naked eye from Earth, including all individual stars outside our galaxy, the Milky Way. A star's life begins with the gravitational collapse of a gaseous nebula of material composed primarily of hydrogen, along with helium and trace amounts of heavier elements."
  },
  {
    id: 3,
    title: "Climate Change and Ocean Currents",
    difficulty: "advanced",
    wordCount: 250,
    text: "Ocean currents play a crucial role in regulating Earth's climate by transporting heat from equatorial regions toward the poles. The thermohaline circulation, often called the global conveyor belt, is driven by differences in water density caused by variations in temperature and salinity. Warm, less dense water rises to the surface and flows poleward, while cold, dense water sinks and flows toward the equator at depth. This circulation pattern helps moderate global temperatures and influences weather patterns worldwide. However, climate change is disrupting these critical ocean currents in unprecedented ways. As global temperatures rise, polar ice caps melt, introducing large volumes of fresh water into the ocean. This influx of fresh water reduces the salinity and density of seawater, potentially slowing or even stopping the sinking of cold water that drives the thermohaline circulation. Scientists have observed a significant slowdown in the Atlantic Meridional Overturning Circulation, which could have far-reaching consequences for global climate patterns, including more extreme weather events and shifts in precipitation patterns."
  },
  {
    id: 4,
    title: "The Art of Mindfulness",
    difficulty: "intermediate",
    wordCount: 180,
    text: "Mindfulness is the practice of purposeful, nonjudgmental awareness of the present moment. It involves paying attention to thoughts, feelings, bodily sensations, and surrounding environment with openness and acceptance. This ancient practice, rooted in Buddhist meditation traditions, has gained widespread recognition in Western psychology and medicine for its mental health benefits. Regular mindfulness practice can reduce stress, anxiety, and depression while improving focus, emotional regulation, and overall well-being. The core principle of mindfulness is observing experiences without immediately reacting or trying to change them. When practicing mindfulness, individuals learn to notice when their mind wanders and gently redirect attention back to the present moment. This can be done through various techniques such as breathing exercises, body scans, or mindful walking. Research has shown that consistent mindfulness practice can actually change brain structure, increasing gray matter in areas associated with learning, memory, and emotional regulation while reducing activity in the amygdala, the brain's fear center."
  },
  {
    id: 5,
    title: "The Mystery of Black Holes",
    difficulty: "advanced",
    wordCount: 300,
    text: "Black holes are among the most fascinating and mysterious objects in the universe. These regions of spacetime exhibit gravitational effects so strong that nothing, not even light, can escape once it crosses the event horizon - the point of no return surrounding a black hole. The concept was first theorized in the 18th century, but it wasn't until Einstein's theory of general relativity that scientists began to understand how such objects could exist. Black holes form when massive stars, typically those with more than 20 times the mass of our Sun, reach the end of their lives and collapse under their own gravity. The core collapses into a singularity - a point of theoretically infinite density where the laws of physics as we know them break down. Surrounding this singularity is the event horizon, whose size depends on the black hole's mass. Supermassive black holes, containing millions or billions of times the mass of the Sun, are thought to exist at the centers of most galaxies, including our own Milky Way. These cosmic giants play a crucial role in galaxy formation and evolution. Despite their name, black holes aren't completely black. Stephen Hawking showed that they emit radiation due to quantum effects near the event horizon, causing them to slowly evaporate over time. This Hawking radiation is incredibly faint for stellar-mass black holes but becomes more significant for smaller ones."
  }
];

export const getPassagesByDifficulty = (difficulty) => {
  return passages.filter(passage => passage.difficulty === difficulty);
};

export const getPassageById = (id) => {
  return passages.find(passage => passage.id === id);
};

export const getTotalWordCount = (passageList) => {
  return passageList.reduce((total, passage) => total + passage.wordCount, 0);
};