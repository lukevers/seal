CREATE TABLE `posts` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `title` varchar(255) DEFAULT NULL,
    `route` varchar(255) NOT NULL,
    `template` varchar(32) NOT NULL,
    `content` mediumtext,
    `markdown` mediumtext,
    `html` mediumtext,
    `read_time` varchar(255) DEFAULT NULL,
    `cover_iamge` varchar(255) DEFAULT NULL,
    `status` ENUM('draft', 'published', 'deleted') NOT NULL DEFAULT 'draft',
    `published_at` timestamp NULL DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` timestamp NULL DEFAULT NULL,
    `owned_by_id` int(10) unsigned NOT NULL,
    `created_by_id` int(10) unsigned NOT NULL,
    `updated_by_id` int(10) unsigned NOT NULL,
    `deleted_by_id` int(10) unsigned DEFAULT NULL,
    KEY `posts_owned_by_foreign_key` (`owned_by_id`),
    KEY `posts_created_by_foreign_key` (`created_by_id`),
    KEY `posts_updated_by_foreign_key` (`updated_by_id`),
    KEY `posts_deleted_by_foreign_key` (`deleted_by_id`),
    CONSTRAINT `posts_owned_by_foreign_key` FOREIGN KEY (`owned_by_id`) REFERENCES `teams` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `posts_created_by_foreign_key` FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `posts_updated_by_foreign_key` FOREIGN KEY (`updated_by_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `posts_deleted_by_foreign_key` FOREIGN KEY (`deleted_by_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
    UNIQUE KEY `posts_unique_route_owned_by_id` (`owned_by_id`, `route`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `post_history` LIKE `posts`;
ALTER TABLE `post_history` MODIFY COLUMN `id` int(10) unsigned NOT NULL, DROP PRIMARY KEY;
ALTER TABLE `post_history` ADD COLUMN `action` ENUM ('insert', 'update', 'delete') NOT NULL DEFAULT 'insert' FIRST;
ALTER TABLE `post_history` ADD COLUMN `revision` INT(6) NOT NULL AFTER `action`;
ALTER TABLE `post_history` ADD COLUMN `revised_at` timestamp NOT NULL AFTER `revision`;
ALTER TABLE `post_history` ADD PRIMARY KEY (`id`, `revision`);
ALTER TABLE `post_history` DROP INDEX `posts_unique_route_owned_by_id`;

CREATE TRIGGER `posts_history_trigger_insert` AFTER INSERT ON `posts` FOR EACH ROW
    INSERT INTO `post_history` SELECT 'insert', (SELECT IFNULL(COUNT(revision)+1, 1) FROM `post_history` as h WHERE h.id = p.id), NOW(), p.* FROM `posts` AS p WHERE p.id = NEW.id;

CREATE TRIGGER `posts_history_trigger_update` AFTER UPDATE ON `posts` FOR EACH ROW
    INSERT INTO `post_history` SELECT 'update', (SELECT IFNULL(COUNT(revision)+1, 1) FROM `post_history` as h WHERE h.id = p.id), NOW(), p.* FROM `posts` AS p WHERE p.id = NEW.id;

CREATE TRIGGER `posts_history_trigger_delete` AFTER DELETE ON `posts` FOR EACH ROW
    INSERT INTO `post_history` SELECT 'delete', (SELECT IFNULL(COUNT(revision)+1, 1) FROM `post_history` as h WHERE h.id = p.id), NOW(), p.* FROM `posts` AS p WHERE p.id = OLD.id;
