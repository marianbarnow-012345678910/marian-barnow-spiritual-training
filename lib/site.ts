/**
 * Photos and short texts shown around the portal.
 * Put image files in /public/images and point to them here (e.g. "/images/marian.jpg").
 * Leave a photo as null and that spot falls back to the sacred-geometry design.
 */
export const site = {
  /** Large photo on the sign-in and sign-up screens. */
  signIn: {
    photo: "/images/marian-portrait.jpg" as string | null,
    /** Which part of the photo stays visible when it's cropped (CSS object-position). */
    focus: "50% 22%",
  },
  teacher: {
    name: "Marian Barnow",
    photo: "/images/marian-teacher.jpg" as string | null, // portrait, ideally 4:5
    photoAlt: "Marian Barnow",
    bio: "Marian is a certified Teacher and Healer, Life Activation Practitioner, and author of The Language of Creation — A Beginner's Guide to Sacred Geometry. He teaches meditation and spiritual training in Dublin.",
    website: "https://www.marianbarnow.com",
  },
  studio: {
    name: "Where we meet",
    photo: null as string | null, // e.g. "/images/studio.jpg" — landscape, ideally 3:2
    photoAlt: "The meditation space in Dublin",
    note: "A calm room in the city centre. Cushions, chairs and blankets are provided — just bring yourself.",
  },
};
