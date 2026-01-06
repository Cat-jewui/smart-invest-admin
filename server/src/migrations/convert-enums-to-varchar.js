const pkg = require('pg');
const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false  }
});

const blocks = [
  // members.grade
  `DO $$
  BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_members_grade') THEN
      ALTER TABLE members ALTER COLUMN grade DROP NOT NULL;
      ALTER TABLE members ALTER COLUMN grade TYPE VARCHAR(20) USING grade::text;
      ALTER TABLE members ALTER COLUMN grade SET DEFAULT 'STANDARD';
      COMMENT ON COLUMN members.grade IS '회원 등급 (STANDARD, DELUXE, PREMIUM)';
    END IF;
  END$$;`,

  // admins.role
  `DO $$
  BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_admins_role') THEN
      ALTER TABLE admins ALTER COLUMN role DROP NOT NULL;
      ALTER TABLE admins ALTER COLUMN role TYPE VARCHAR(20) USING role::text;
      COMMENT ON COLUMN admins.role IS '권한 (SUPER_ADMIN, ADMIN)';
    END IF;
  END$$;`,

  // chat_messages.sender_type
  `DO $$
  BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_chat_messages_sender_type') THEN
      ALTER TABLE chat_messages ALTER COLUMN sender_type DROP NOT NULL;
      ALTER TABLE chat_messages ALTER COLUMN sender_type TYPE VARCHAR(20) USING sender_type::text;
      COMMENT ON COLUMN chat_messages.sender_type IS '유저 타입 (USER, ADMIN)';
    END IF;
  END$$;`,

  // reviews.source
  `DO $$
  BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_reviews_source') THEN
      ALTER TABLE reviews ALTER COLUMN source DROP NOT NULL;
      ALTER TABLE reviews ALTER COLUMN source TYPE VARCHAR(20) USING source::text;
      COMMENT ON COLUMN reviews.source IS '리뷰 출처 (KMONG, WEBSITE)';
    END IF;
  END$$;`,

  // costs.category
  `DO $$
  BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_costs_category') THEN
      ALTER TABLE costs ALTER COLUMN category DROP NOT NULL;
      ALTER TABLE costs ALTER COLUMN category TYPE VARCHAR(20) USING category::text;
      COMMENT ON COLUMN costs.category IS '비용 카테고리 (PAYMENT_FEE, KMONG_FEE, SERVER, DOMAIN, MARKETING, ETC)';
    END IF;
  END$$;`
];

async function run() {
  try {
    await client.connect();
    for (const sql of blocks) {
      console.log('Running block...');
      await client.query(sql);
      console.log('OK');
    }
    console.log('All done');
  } catch (err) {
    console.error('Error running migration:', err);
  } finally {
    await client.end();
  }
}

run();
