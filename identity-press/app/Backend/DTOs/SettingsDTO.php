<?php //phpcs:ignore WordPress.Files.FileName.NotHyphenatedLowercase
namespace App\Backend\DTOs;

defined( 'ABSPATH' ) || exit;

/**
 * Data Transfer Object for plugin settings.
 *
 * @since      1.0.0
 * @package    IdentityPress
 * @subpackage App\Backend\DTOs
 */
class SettingsDTO {
	/**
	 * @var array
	 */
	public array $general;

	/**
	 * @var array
	 */
	public array $gateways;

	/**
	 * @var array
	 */
	public array $style;

	/**
	 * SettingsDTO constructor.
	 *
	 * @param array $data
	 */
	public function __construct( array $data ) {
		$this->general  = $data['general'] ?? array();
		$this->gateways = $data['gateways'] ?? array();
		$this->style    = $data['style'] ?? array();
	}

	/**
	 * Convert DTO to array.
	 *
	 * @return array
	 */
	public function to_array(): array {
		return array(
			'general'  => $this->general,
			'gateways' => $this->gateways,
			'style'    => $this->style,
		);
	}

	/**
	 * Create DTO from array.
	 *
	 * @param array $data
	 * @return self
	 */
	public static function from_array( array $data ): self {
		return new self( $data );
	}
}
