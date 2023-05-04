export const resultresp = (status, msg, data) => {
  return {
    status,
    message: !msg ? 'Success' : msg,
    data
  }
}

export const epdata = {
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    epdata: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          title: {
            type: "null",
          },
          image: {
            type: "string",
          },
          number: {
            type: "number",
          },
          description: {
            type: "null",
          },
          url: {
            type: "null",
          },
        },
        required: ["id", "number", "image"],
      },
    },
  },
  required: ["id", "epdata"],
};

export const streamdata = {
  type: "object",
  properties: {
    gogo_id: {
      type: "string",
    },
    episode: { type: "number" },
    stream: {
      type: "array",
      items: {
        type: "object",
        properties: {
          url: { type: "string" },
          isM3U8: { type: "boolean" },
        },
        required: ["url", "isM3U8"],
      },
    },
    iframe: { type: "string" },
    player: {
      plyr: { type: "string" },
      nspl: { type: "string" },
    },
  },
  required: ["gogo_id", "episode", "iframe", "stream"],
};

export const searchvalid = {
  type: "object",
  properties: {
    search: {
      type: "string",
    },
    page: {
      type: "number",
    },
    size: {
      type: "number",
    },
    type: {
      type: "string",
    },
    isAdult: {
      type: "string",
    },
    format: {
      type: "array",
      items: {
        type: "string",
        required: true,
      },
    },
    season: {
      type: "string",
    },
    year: {
      type: "string",
    },
    genres: {
      type: "array",
      items: {
        type: "string",
        required: true,
      },
    },
    tags: {
      type: "array",
      items: {
        type: "string",
        required: true,
      },
    },
    sort: {
      type: "array",
      items: {
        type: "string",
        required: true,
      },
    },
  },
  required: ["search"],
};

export default {
  resultresp
}