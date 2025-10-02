# Saros-Position-Viewer

This is built using the workshop template repository availavle at [Intro to DLMM SDK](https://saros-playground.vercel.app/workshops)

# Hover over bars to see which position they belong to
<img width="1920" height="562" alt="image" src="https://github.com/user-attachments/assets/0df469fe-e282-496c-9675-a6d11255aa7c" />

# Click buttons to highlight different positions
<img width="1915" height="567" alt="image" src="https://github.com/user-attachments/assets/baed5a23-0854-4d81-b144-85bf924e2d5f" />
<img width="1920" height="560" alt="image" src="https://github.com/user-attachments/assets/e3c352c2-2e76-42ac-bf7d-28300a6d0ac9" />


## Workshop Details

For more information about this workshop, including detailed instructions, examples, and resources, please visit:

[Saros DLMM SDK](https://github.com/saros-xyz/dlmm-saros-sdk)

[Youtube link](https://www.youtube.com/watch?v=4gkEHqVbw4w)

[Template link](https://saros-playground.vercel.app/workshops)


## Getting Started

### RPC URL
The RPC URL I have used is from Helius, from the free-tiee, with Rate-limits.
To use teh same you may create an account on Helius and get the API key and then create an environment variable
- Create '.env' file in root, add variable 'NEXT_PUBLIC_RPC_URL'
- To it add "https://mainnet.helius-rpc.com/?{Your Helius API KEY}"


### Prerequisites

Make sure you have Node.js installed on your system.

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

### How to get results
At ".|src\lib\position.ts"
- Add your wallet address at 'PAYER'
- Add the pool you have a position in at 'POOL_ADDRESS'

At "./" , create a '.env' file
- Add Helius mainnet RPC URL at 'NEXT_PUBLIC_RPC_URL'



### Running the Development Server

To start the development server:

```bash
 npm run dev
```

The application will be available at `http://localhost:3000`


## Project Structure

- `src/app/` - Main application files
- `src/components/` - Reusable UI components
- `src/lib/` - Utility functions and types
- `public/` - Static assets

## Technologies Used

- Next.js
- TypeScript
- Tailwind CSS
- Recharts (for data visualization)
