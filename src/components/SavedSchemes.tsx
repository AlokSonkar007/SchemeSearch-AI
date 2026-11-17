import { Bookmark, Eye, Trash2, Search } from "lucide-react";
import type { Scheme } from "../types/scheme";

type Props = {
  schemes: Scheme[];
  onViewScheme: (id: string) => void;
  onRemove: (id: string) => void;
  onExplore: () => void;
};

export default function SavedSchemes({
  schemes,
  onViewScheme,
  onRemove,
  onExplore,
}: Props) {
  if (schemes.length === 0) {
    return (
      <section className="panel recommendation-empty">
        <div className="empty-icon">
          <Bookmark size={25} />
        </div>
        <h3>No saved schemes yet</h3>
        <p>
          Bookmark schemes that interest you. They will be collected here
          for easy access.
        </p>
        <button className="primary-button" onClick={onExplore}>
          Explore schemes <Search size={16} />
        </button>
      </section>
    );
  }

  return (
    <section className="saved-page">
      <div className="saved-intro">
        <div>
          <h2>Your saved opportunities</h2>
          <p>{schemes.length} scheme(s) bookmarked</p>
        </div>
        <Bookmark size={23} />
      </div>

      <div className="saved-grid">
        {schemes.map((scheme) => (
          <article className="saved-card" key={scheme.id}>
            <div className="result-category">{scheme.category}</div>
            <h3>{scheme.name}</h3>
            <p>{scheme.description}</p>

            <div className="saved-card-footer">
              <button
                className="secondary-button"
                onClick={() => onViewScheme(scheme.id)}
              >
                <Eye size={15} /> View details
              </button>

              <button
                className="icon-action danger-action"
                aria-label={`Remove ${scheme.name}`}
                onClick={() => onRemove(scheme.id)}
                title="Remove saved scheme"
              >
                <Trash2 size={17} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
