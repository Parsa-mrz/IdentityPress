<?php //phpcs:ignore WordPress.Files.FileName.NotHyphenatedLowercase
namespace App\Backend\Actions;

use App\Backend\Repositories\SettingsRepository;
use App\Backend\DTOs\SettingsDTO;

defined( 'ABSPATH' ) || exit;

/**
 * Action class for updating plugin settings.
 *
 * @since      1.0.0
 * @package    IdentityPress
 * @subpackage App\Backend\Actions
 */
class UpdateSettingsAction {
	/**
	 * The settings repository instance.
	 *
	 * @var SettingsRepository
	 */
	private SettingsRepository $repository;

	/**
	 * UpdateSettingsAction constructor.
	 */
	public function __construct() {
		$this->repository = new SettingsRepository();
	}

	/**
	 * Execute the action to update settings.
	 *
	 * @param string $group The settings group.
	 * @param array  $data  The settings data.
	 * @return bool
	 */
	public function execute( string $group, array $data ): bool {
		$current_settings = $this->repository->get_all();

		$settings_dto = new SettingsDTO( $current_settings );

		if ( property_exists( $settings_dto, $group ) ) {
			$settings_dto->$group = wp_parse_args( $data, $settings_dto->$group );
		}

		return $this->repository->update_group( $group, $settings_dto->$group );
	}
}
