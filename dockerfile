# Use Bun official image
FROM oven/bun:1.1

# Set working directory
WORKDIR /app

# Copy Bun config and install dependencies
COPY bun.lockb package.json ./
RUN bun install

# Copy the rest of the source code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Run the app
CMD ["bun", "start"]
