import { APP_VERSION } from '../version';

const VersionDisplay = () => {
  return (
    <div className="version-display">
      v{APP_VERSION}
    </div>
  );
};

export default VersionDisplay;