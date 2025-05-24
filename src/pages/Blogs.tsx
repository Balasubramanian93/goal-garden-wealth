import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Blogs = () => {
  // Placeholder for personalized blog suggestions based on user investment patterns
  const getPersonalizedBlogSuggestions = () => {
    // In a real application, this would fetch data from an API
    // based on the user's investment patterns.
    return [
      {
        title: 'Understanding Stock Market Volatility',
        thumbnail: 'https://via.placeholder.com/150x100',
        description: 'Learn about the factors that drive stock market volatility and how to manage risk.'
      },
      {
        title: "Beginner's Guide to Investing in Bonds",
        thumbnail: 'https://via.placeholder.com/150x100',
        description: 'Discover the basics of bond investing and how bonds can fit into your portfolio.'
      },
      {
        title: 'Real Estate Investment Strategies',
        thumbnail: 'https://via.placeholder.com/150x100',
        description: 'Explore different strategies for investing in real estate and building wealth.'
      },
    ];
  };

  const personalizedBlogs = getPersonalizedBlogSuggestions();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4">Financial Blogs</h1>

      <h2 className="text-xl font-semibold mb-2">Recommended for You</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {personalizedBlogs.map((blog, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{blog.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={blog.thumbnail} alt={blog.title} className="mb-4" />
              <CardDescription>{blog.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Link to="#" className="text-blue-500 hover:underline">Read More</Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">More Articles</h2>
      <ul>
        <li>
          <a href="#" className="text-blue-500 hover:underline">The Impact of Inflation on Investments</a>
        </li>
        <li>
          <a href="#" className="text-blue-500 hover:underline">How to Diversify Your Portfolio</a>
        </li>
        <li>
          <a href="#" className="text-blue-500 hover:underline">Retirement Planning Tips</a>
        </li>
      </ul>
    </div>
  );
};

export default Blogs;
