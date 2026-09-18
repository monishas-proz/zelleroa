-- Agent referral attribution: an "agent" is an existing user (users.role_id
-- pointing at the new AGENT role) who can be credited for a signup and/or an
-- order via a shareable ?ref=<referral_code> link.

-- 1. Give any user a shareable referral code (agents will have one; other
--    users leave it null).
ALTER TABLE `users`
  ADD COLUMN `referral_code` VARCHAR(30) NULL,
  ADD COLUMN `referred_by_agent_id` BIGINT UNSIGNED NULL,
  ADD COLUMN `referred_at` TIMESTAMP(0) NULL;

ALTER TABLE `users`
  ADD UNIQUE INDEX `users_referral_code` (`referral_code`);

ALTER TABLE `users`
  ADD INDEX `fk_users_referred_by_agent` (`referred_by_agent_id`);

ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_referred_by_agent`
  FOREIGN KEY (`referred_by_agent_id`) REFERENCES `users` (`id`)
  ON DELETE NO ACTION ON UPDATE NO ACTION;

-- 2. Attribute the order itself (commission is computed off this), resolved
--    at checkout time per the cookie -> signup fallback priority.
ALTER TABLE `orders`
  ADD COLUMN `agent_id` BIGINT UNSIGNED NULL;

ALTER TABLE `orders`
  ADD INDEX `fk_orders_agent` (`agent_id`);

ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_agent`
  FOREIGN KEY (`agent_id`) REFERENCES `users` (`id`)
  ON DELETE NO ACTION ON UPDATE NO ACTION;
