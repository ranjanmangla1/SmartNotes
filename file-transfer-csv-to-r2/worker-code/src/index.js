/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


export default {
	async fetch(request, env, ctx) {
	  if (request.method === 'HEAD' || request.method === 'OPTIONS') {
		// Handle HEAD and OPTIONS requests for CORS
		return new Response(null, {
		  headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS,PUT",
			"Access-Control-Allow-Headers": "Authorization, Content-Type",
			"Access-Control-Max-Age": "86400",
		  }
		});
	  }
  
	  if (request.method === 'GET') {
		return new Response('Hello');
	  }
  
	  if (request.method === 'PUT') {
		// Check Authorization header
		const auth = request.headers.get('Authorization');
		console.log(auth);
		const expectedAuth = `Bearer ${env.AUTH_SECRET2}`;
		console.log(`expected AUth: ${expectedAuth}`)
  
		if (!auth || auth !== expectedAuth) {
		  return new Response('Unauthorized', { status: 401 });
		}
  
		const corsHeaders = {
		  "Access-Control-Allow-Origin": "*",
		  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS,PUT",
		  "Access-Control-Allow-Headers": "Authorization, Content-Type",
		  "Access-Control-Max-Age": "86400",
		};

		const contentType = request.headers.get('Content-Type');

		let	key = `file_${Date.now()}`;

		await env.FILE_MIGRATE_BUCKET.put(key, request.body, {
			httpMetadata: {
				contentType: contentType
			}
		});
		const data = `Object ${key} uploaded successfully!`;
  
		return new Response(JSON.stringify(data), {
		  headers: {
			...corsHeaders,
			'Content-Type': 'application/json;charset=UTF-8'
		  }
		});
	  }
  
	  // Handle other cases with CORS headers
	  return new Response(null, {
		headers: {
		  "Access-Control-Allow-Origin": "*",
		  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS,PUT",
		  "Access-Control-Allow-Headers": "Authorization, Content-Type",
		  "Access-Control-Max-Age": "86400",
		}
	  });
	},
  };