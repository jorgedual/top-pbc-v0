 SELECT
    c.id,
    c.content,
    c.created_at,
    c.product_id,
    p.name as product_name,
    c.user_id,
    u.email as user_email,
    u.raw_user_meta_data->>'full_name' as user_full_name
  FROM comments c
  JOIN products p ON c.product_id = p.id
  LEFT JOIN auth.users u ON c.user_id = u.id
  ORDER BY c.created_at DESC;
