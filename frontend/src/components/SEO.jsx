import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, keywords, image, type = "website" }) => {
  const siteTitle = title ? `${title} | EZStore` : "EZStore - Pet Supplies";

  return (
    <Helmet>
      <title>{siteTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}

      <meta property="og:title" content={title || "EZStore"} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:type" content={type} />
    </Helmet>
  );
};

export default SEO;
